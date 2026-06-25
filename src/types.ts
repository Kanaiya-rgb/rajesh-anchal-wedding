export interface RSVP {
  id?: string;
  fullName: string;
  phoneOrEmail: string;
  attendingEvents: string[]; // e.g. ["Haldi", "Mehendi", "Sangeet", "Wedding", "Reception"]
  guestsCount: number;
  foodPreference: 'veg' | 'non-veg' | 'jain';
  specialMessage?: string;
  submittedAt: Date;
}

export interface BlessingMessage {
  id?: string;
  senderName: string;
  relation: string; // e.g. "Friend", "Family of Groom", "Family of Bride", "Well Wisher"
  message: string;
  cardStyle: number; // For styling the blessing card in different traditional hues
  submittedAt: Date;
}

export interface WeddingEvent {
  id: string;
  name: string;
  nameHindi: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  iconName: string; // lucide icon name
  color: string; // Tailwind bg color class
}
