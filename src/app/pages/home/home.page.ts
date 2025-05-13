import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassEventsService } from '../../services/class-events.service';
import { ClassEvent } from '../../interfaces/class-event';
import { StorageService } from '../../services/core/storage.service';

interface RoomStructure {
  floors: { [key: string]: string[] };
  rooms: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  protected date: string;
  selectedFloor: string = 'all';
  selectedRoom: string = 'all';
  searchText: string = '';
  currentEvents: ClassEvent[] = [];
  currentBuilding: string = 'AP152';
  roomStructure: RoomStructure = {
    floors: {},
    rooms: []
  };

  constructor(
    private classEventsService: ClassEventsService,
    private router: Router
  ) {
    // Initialize date to today
    this.date = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    // Load the building from storage
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
    this.classEventsService.loadClassEvents({
      q: this.currentBuilding,
      start: this.date,
      end: this.date
    }).subscribe(
      (events: ClassEvent[]) => {
        this.currentEvents = this.sortEventsByTime(events);
      },
      error => {
        console.error('Error loading events:', error);
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

    console.log('Extracted room structure:', {
      floors: Object.keys(this.roomStructure.floors),
      totalRooms: this.roomStructure.rooms.length
    });
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

  sortEventsByTime(events: ClassEvent[]): ClassEvent[] {
    return events.sort((a, b) => {
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });
  }

  getFilteredEvents(events: ClassEvent[]): ClassEvent[] {
    return events.filter(event => {
      const parts = event.tmp.split('.');
      const floor = parts[1];
      const room = parts[2];

      const matchesFloor = this.selectedFloor === 'all' || floor === this.selectedFloor;
      const matchesRoom = this.selectedRoom === 'all' || room === this.selectedRoom;
      const matchesSearch = !this.searchText || 
        event.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
        event.tmp.toLowerCase().includes(this.searchText.toLowerCase());
      
      return matchesFloor && matchesRoom && matchesSearch;
    });
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  handleDateChange(event: any) {
    const value = event.detail.value;
    if (typeof value === 'string') {
      this.date = value.split('T')[0];
    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      this.date = value[0].split('T')[0];
    }
    this.onDateChange();
  }

  getDuration(start: string, end: string): string {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
    const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (durationHours === 0) {
      return `${durationMinutes}m`;
    } else if (durationMinutes === 0) {
      return `${durationHours}h`;
    } else {
      return `${durationHours}h ${durationMinutes}m`;
    }
  }

  onDateChange() {
    this.loadEvents();
  }

  onFloorChange(event: any) {
    this.selectedFloor = event.detail.value;
    // Reset room selection when floor changes
    this.selectedRoom = 'all';
  }

  onRoomChange(event: any) {
    this.selectedRoom = event.detail.value;
  }

  isEventCurrent(event: ClassEvent): boolean {
    const now = new Date();
    const start = new Date(event.start);
    const end = new Date(event.end);
    return start <= now && end >= now;
  }

  isEventUpcoming(event: ClassEvent): boolean {
    const now = new Date();
    const start = new Date(event.start);
    return start > now;
  }

  isEventPast(event: ClassEvent): boolean {
    const now = new Date();
    const end = new Date(event.end);
    return end < now;
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

  navigateToOnboarding() {
    this.router.navigateByUrl('/onboarding');
  }
}
