import { Component, OnInit } from '@angular/core';
import { ClassEventsService } from '../../services/class-events.service';
import { ClassEvent } from '../../interfaces/class-event';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../services/core/storage.service';

interface FreeTimeSlot {
  id: string;
  title: string;
  start: string;
  end: string;
  room: string;
  duration: string;
  durationMinutes: number;
  color: string;
}

interface RoomStructure {
  floors: { [key: string]: string[] };
  rooms: string[];
}

@Component({
  selector: 'app-free-rooms',
  templateUrl: './free-rooms.page.html',
  styleUrls: ['./free-rooms.page.scss'],
})
export class FreeRoomsPage implements OnInit {
  protected date: string;
  protected time: string;
  selectedFloor: string = 'all';
  selectedRoom: string = 'all';
  searchText: string = '';
  
  // All events and free slots
  currentEvents: ClassEvent[] = [];
  allFreeTimeSlots: FreeTimeSlot[] = [];
  
  // Categorized free slots
  freeNowSlots: FreeTimeSlot[] = [];
  freeSoonSlots: FreeTimeSlot[] = [];
  
  // Pagination
  freeNowPage: number = 0;
  freeSoonPage: number = 0;
  readonly ITEMS_PER_PAGE: number = 5;
  
  // Room structure for filtering
  roomStructure: RoomStructure = {
    floors: {},
    rooms: []
  };
  
  // Building operation hours and thresholds
  private readonly BUILDING_OPEN = '08:00';
  private readonly BUILDING_CLOSE = '18:15';
  private readonly MIN_SOON_DURATION = 45; // minutes
  
  // Current building
  currentBuilding: string = 'AP152';

  // Modal state
  isModalOpen: boolean = false;
  selectedRoomForModal: string = '';
  roomEvents: ClassEvent[] = [];
  freeTimeSlots: FreeTimeSlot[] = [];
  allTimeSlots: any[] = []; // Combined timeline for the modal

  constructor(
    private classEventsService: ClassEventsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialize date to today
    this.date = new Date().toISOString().split('T')[0];
    
    // Initialize time to current time (rounded to nearest 5 minutes)
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = (Math.floor(now.getMinutes() / 5) * 5).toString().padStart(2, '0');
    this.time = `${hours}:${minutes}`;
  }

  ngOnInit() {
    // Check for saved building in storage
    const savedBuilding = StorageService.getItem('selectedBuilding');
    if (savedBuilding) {
      this.currentBuilding = savedBuilding;
    }
    
    // First load the complete dataset to extract room structure
    this.loadCompleteDataset();
    // Then load events for the current date
    this.loadEvents();
  }

  loadCompleteDataset() {
    // Load all events without date filtering to get complete room structure
    this.classEventsService.loadClassEvents({
      q: this.currentBuilding
    }).subscribe(
      (events: ClassEvent[]) => {
        this.extractRoomStructure(events);
      },
      error => {
        console.error('Error loading complete dataset:', error);
      }
    );
  }

  loadEvents() {
    console.log('Fetching events for date:', this.date);
    this.classEventsService.loadClassEvents({
      q: this.currentBuilding,
      start: this.date,
      end: this.date
    }).subscribe(
      (events: ClassEvent[]) => {
        console.log(`Received ${events.length} events for date ${this.date}`);
        this.currentEvents = events;
        this.calculateFreeTimeSlots();
        this.categorizeFreeSlots();
      },
      error => {
        console.error('Error loading events:', error);
        // Still calculate free slots even if there's an error (assuming no events)
        this.currentEvents = [];
        this.calculateFreeTimeSlots();
        this.categorizeFreeSlots();
      }
    );
  }

  extractRoomStructure(events: ClassEvent[]) {
    const floors: { [key: string]: Set<string> } = {};
    const rooms = new Set<string>();

    events.forEach(event => {
      // Extract room code from tmp (which contains the full room code like AP152.01.108)
      const parts = event.tmp.split('.');
      if (parts.length === 3) {
        const floor = parts[1];
        const room = parts[2];
        
        // Add to floors structure
        if (!floors[floor]) {
          floors[floor] = new Set<string>();
        }
        floors[floor].add(room);
        rooms.add(room);
      }
    });

    // Convert Sets to sorted arrays
    this.roomStructure.floors = Object.fromEntries(
      Object.entries(floors).map(([floor, roomSet]) => [
        floor,
        Array.from(roomSet).sort((a, b) => a.localeCompare(b))
      ])
    );
    this.roomStructure.rooms = Array.from(rooms).sort((a, b) => a.localeCompare(b));
  }

  getAvailableFloors(): string[] {
    return Object.keys(this.roomStructure.floors).sort((a, b) => {
      // Sort with EG (ground floor) first
      if (a === 'EG') return -1;
      if (b === 'EG') return 1;
      return a.localeCompare(b);
    });
  }

  getAvailableRooms(): string[] {
    if (this.selectedFloor === 'all') {
      return this.roomStructure.rooms;
    }
    return this.roomStructure.floors[this.selectedFloor] || [];
  }

  calculateFreeTimeSlots() {
    // Group events by room
    const eventsByRoom = this.groupEventsByRoom();
    const freeSlots: FreeTimeSlot[] = [];

    // Generate free slots for all available rooms (even ones with no events today)
    this.getAvailableFloors().forEach(floor => {
      if (this.selectedFloor !== 'all' && this.selectedFloor !== floor) {
        return; // Skip floors that don't match filter
      }

      const roomsInFloor = this.roomStructure.floors[floor] || [];
      
      roomsInFloor.forEach(roomNum => {
        if (this.selectedRoom !== 'all' && this.selectedRoom !== roomNum) {
          return; // Skip rooms that don't match filter
        }

        const room = `${this.currentBuilding}.${floor}.${roomNum}`;
        const events = eventsByRoom[room] || [];
        
        // Find free slots for this room
        const roomFreeSlots = this.findFreeTimeSlotsForRoom(room, events);
        freeSlots.push(...roomFreeSlots);
      });
    });

    this.allFreeTimeSlots = freeSlots;
  }

  private groupEventsByRoom(): { [key: string]: ClassEvent[] } {
    const rooms: { [key: string]: ClassEvent[] } = {};
    
    this.currentEvents.forEach(event => {
      const room = event.tmp; // room code from event
      if (!rooms[room]) {
        rooms[room] = [];
      }
      rooms[room].push(event);
    });

    // Sort events in each room by start time
    Object.values(rooms).forEach(events => {
      events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    });

    return rooms;
  }

  private findFreeTimeSlotsForRoom(room: string, events: ClassEvent[]): FreeTimeSlot[] {
    const freeSlots: FreeTimeSlot[] = [];
    const today = this.date;
    let currentTime = `${today}T${this.BUILDING_OPEN}:00`;

    // If no events, the entire day is free
    if (events.length === 0) {
      freeSlots.push(this.createFreeTimeSlot(room, currentTime, `${today}T${this.BUILDING_CLOSE}:00`));
      return freeSlots;
    }

    // Add free slots between events
    events.forEach(event => {
      if (new Date(currentTime) < new Date(event.start)) {
        freeSlots.push(this.createFreeTimeSlot(room, currentTime, event.start));
      }
      currentTime = event.end;
    });

    // Add final slot if there's time after the last event
    const finalTime = `${today}T${this.BUILDING_CLOSE}:00`;
    if (new Date(currentTime) < new Date(finalTime)) {
      freeSlots.push(this.createFreeTimeSlot(room, currentTime, finalTime));
    }

    return freeSlots;
  }

  private createFreeTimeSlot(room: string, start: string, end: string): FreeTimeSlot {
    const durationMinutes = this.calculateDurationMinutes(start, end);
    const duration = this.formatDuration(durationMinutes);
    
    return {
      id: `free_${room}_${start}`,
      title: `Free Room`,
      start,
      end,
      room,
      duration,
      durationMinutes,
      color: '#28a745' // Green color for free slots
    };
  }

  private calculateDurationMinutes(start: string, end: string): number {
    const startTime = new Date(start);
    const endTime = new Date(end);
    return Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  }

  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  }

  categorizeFreeSlots() {
    const currentDateTime = `${this.date}T${this.time}:00`;
    const currentTime = new Date(currentDateTime);
    
    // Reset pagination
    this.freeNowPage = 0;
    this.freeSoonPage = 0;
    
    // Apply search filter to all slots first
    const filteredSlots = this.applySearchFilter(this.allFreeTimeSlots);
    
    // Free now: slots that include the current time
    this.freeNowSlots = filteredSlots
      .filter(slot => {
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        return slotStart <= currentTime && slotEnd > currentTime;
      })
      .map(slot => {
        // Adjust the start time to current time for accurate remaining duration
        const adjustedSlot = { ...slot };
        if (new Date(slot.start) < currentTime) {
          const remainingMinutes = this.calculateDurationMinutes(currentDateTime, slot.end);
          adjustedSlot.start = currentDateTime;
          adjustedSlot.durationMinutes = remainingMinutes;
          adjustedSlot.duration = this.formatDuration(remainingMinutes);
        }
        return adjustedSlot;
      })
      .sort((a, b) => b.durationMinutes - a.durationMinutes); // Sort by longest duration first

    // Free soon: slots that start after the current time
    this.freeSoonSlots = filteredSlots
      .filter(slot => {
        const slotStart = new Date(slot.start);
        return slotStart > currentTime && slot.durationMinutes >= this.MIN_SOON_DURATION;
      })
      .sort((a, b) => {
        // Sort by starting time (soonest first)
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
  }

  applySearchFilter(slots: FreeTimeSlot[]): FreeTimeSlot[] {
    if (!this.searchText || this.searchText.trim() === '') {
      return slots;
    }
    
    const searchLower = this.searchText.toLowerCase();
    return slots.filter(slot => 
      slot.room.toLowerCase().includes(searchLower) ||
      slot.title.toLowerCase().includes(searchLower)
    );
  }

  onSearchChange() {
    this.categorizeFreeSlots();
  }

  getFreeNowSlotsPage(): FreeTimeSlot[] {
    const startIndex = 0;
    const endIndex = this.ITEMS_PER_PAGE * (this.freeNowPage + 1);
    return this.freeNowSlots.slice(startIndex, endIndex);
  }

  getFreeSoonSlotsPage(): FreeTimeSlot[] {
    const startIndex = 0;
    const endIndex = this.ITEMS_PER_PAGE * (this.freeSoonPage + 1);
    return this.freeSoonSlots.slice(startIndex, endIndex);
  }

  loadMoreFreeNow() {
    this.freeNowPage++;
  }

  loadMoreFreeSoon() {
    this.freeSoonPage++;
  }

  hasMoreFreeNow(): boolean {
    return this.getFreeNowSlotsPage().length < this.freeNowSlots.length;
  }

  hasMoreFreeSoon(): boolean {
    return this.getFreeSoonSlotsPage().length < this.freeSoonSlots.length;
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateTimeUntilAvailable(start: string): string {
    const currentDateTime = `${this.date}T${this.time}:00`;
    const currentTime = new Date(currentDateTime);
    const startTime = new Date(start);
    
    const waitTimeMinutes = Math.floor((startTime.getTime() - currentTime.getTime()) / (1000 * 60));
    
    if (waitTimeMinutes < 60) {
      return `${waitTimeMinutes}m`;
    } else {
      const hours = Math.floor(waitTimeMinutes / 60);
      const minutes = waitTimeMinutes % 60;
      
      if (minutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${minutes}m`;
      }
    }
  }

  getISOTimeString(): string {
    // Convert HH:MM to full ISO string for ion-datetime
    const today = new Date().toISOString().split('T')[0];
    return `${today}T${this.time}:00.000Z`;
  }

  onDateChange() {
    console.log('Loading events for date:', this.date);
    // Reset pagination when date changes
    this.freeNowPage = 0;
    this.freeSoonPage = 0;
    
    // Clear existing events and slots
    this.currentEvents = [];
    this.allFreeTimeSlots = [];
    this.freeNowSlots = [];
    this.freeSoonSlots = [];
    
    // Load new events for the selected date
    this.loadEvents();
  }

  onTimeChange() {
    console.log('Time changed to:', this.time);
    this.categorizeFreeSlots();
  }

  handleDateChange(event: any) {
    const value = event.detail.value;
    let newDate = '';
    
    if (typeof value === 'string') {
      newDate = value.split('T')[0];
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      newDate = value[0].split('T')[0];
    }
    
    if (newDate && this.date !== newDate) {
      console.log('Date changed from', this.date, 'to', newDate);
      this.date = newDate;
      this.onDateChange();
    }
  }

  handleTimeChange(event: any) {
    const value = event.detail.value;
    let timeStr = '';
    
    if (typeof value === 'string') {
      timeStr = value.split('T')[1].substring(0, 5);
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      timeStr = value[0].split('T')[1].substring(0, 5);
    }
    
    if (timeStr && this.time !== timeStr) {
      this.time = timeStr;
      console.log('Setting time to:', this.time);
      this.onTimeChange();
    }
  }

  onFloorChange(event: any) {
    this.selectedFloor = event.detail.value;
    this.selectedRoom = 'all';
    this.calculateFreeTimeSlots();
    this.categorizeFreeSlots();
  }

  onRoomChange(event: any) {
    this.selectedRoom = event.detail.value;
    this.calculateFreeTimeSlots();
    this.categorizeFreeSlots();
  }

  getFloorLabel(floor: string): string {
    if (floor === 'EG') return 'Ground Floor';
    return `${parseInt(floor)}${this.getOrdinalSuffix(parseInt(floor))} Floor`;
  }

  private getOrdinalSuffix(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  openRoomSchedule(roomCode: string) {
    this.selectedRoomForModal = roomCode;
    this.loadRoomSchedule(roomCode);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.roomEvents = [];
    this.freeTimeSlots = [];
    this.allTimeSlots = [];
  }

  loadRoomSchedule(roomCode: string) {
    // Filter events for this room
    this.roomEvents = this.currentEvents.filter(event => 
      event.tmp === roomCode
    ).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

    // Get free time slots for this room
    this.freeTimeSlots = this.findFreeTimeSlotsForRoom(roomCode, this.roomEvents)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    // Create a combined timeline of booked events and free slots
    this.createCombinedTimeline();
  }

  createCombinedTimeline() {
    this.allTimeSlots = [];
    
    // Add booked events
    this.roomEvents.forEach(event => {
      // Parse the event title to extract information
      let title = event.title;
      let instructor = '';
      
      if (event.title.includes(',')) {
        // Examples: 
        // "Design & Research 2 , Lagger Ursula, Standardgruppe, AP152.03.308 (CMS 2024)"
        // "Multimediales Storytelling: Design und Technik, Kühnelt Wolfgang, JPR24 G2, AP152.02.203 (JPR 2024)"
        const titleParts = event.title.split(',');
        
        // First part is the course name
        title = titleParts[0].trim();
        
        // Second part is usually the instructor
        if (titleParts.length > 1) {
          instructor = titleParts[1].trim();
        }
        
        // Remove parenthetical information from title
        const parenIndex = title.indexOf('(');
        if (parenIndex > 0) {
          title = title.substring(0, parenIndex).trim();
        }
      }
      
      this.allTimeSlots.push({
        start: event.start,
        end: event.end,
        title: title,
        instructor: instructor,
        isFree: false,
        duration: this.getDuration(event.start, event.end)
      });
    });
    
    // Add free slots
    this.freeTimeSlots.forEach(slot => {
      this.allTimeSlots.push({
        start: slot.start,
        end: slot.end,
        title: "Free Room",
        instructor: '',
        isFree: true,
        duration: slot.duration
      });
    });
    
    // Sort all slots by start time
    this.allTimeSlots.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }

  getHoursArray(): number[] {
    // Return hours from 8 to 18 for the timeline
    return Array.from({ length: 11 }, (_, i) => i + 8);
  }

  getSlotStyle(slot: any): any {
    const startDate = new Date(slot.start);
    const endDate = new Date(slot.end);
    
    // Calculate position and height based on time
    const startHour = startDate.getHours() + startDate.getMinutes() / 60;
    const endHour = endDate.getHours() + endDate.getMinutes() / 60;
    
    // Position is relative to 8am (our first hour marker)
    const top = (startHour - 8) * 48; // Each hour is 48px
    const height = (endHour - startHour) * 48;
    
    return {
      position: 'absolute',
      top: `${top}px`,
      height: `${height}px`,
      left: 0,
      right: 0,
      pointerEvents: 'none'
    };
  }

  getDuration(start: string, end: string): string {
    const durationMinutes = this.calculateDurationMinutes(start, end);
    return this.formatDuration(durationMinutes);
  }

  // Format the time with proper locale
  formatTimeRange(start: string, end: string): string {
    return `${this.formatTime(start)}–${this.formatTime(end)}`;
  }

  navigateToOnboarding() {
    this.router.navigateByUrl('/onboarding');
  }
} 