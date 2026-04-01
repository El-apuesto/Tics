import type { Show } from '@/types';

// Get current day of week
const getCurrentDay = (): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

// Check if a date has passed
const hasDatePassed = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day for comparison
  date.setHours(0, 0, 0, 0);
  return date < today;
};

// Check if a date is a specific day of week (not a full date)
const isDayOfWeek = (dateString: string): boolean => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysOfWeek.includes(dateString);
};

// Get filtered shows based on current day
export const getFilteredShows = (shows: Show[]): Show[] => {
  const currentDay = getCurrentDay();
  
  // On Sunday, show all weekly recurring shows + valid future dated shows
  if (currentDay === 'Sunday') {
    return shows.filter(show => {
      if (isDayOfWeek(show.date)) {
        return true; // Show all weekly recurring shows
      }
      // Only show dated shows that haven't passed
      return !hasDatePassed(show.date);
    });
  }
  
  // On other days, only show shows for that specific day + valid future dated shows
  return shows.filter(show => {
    if (isDayOfWeek(show.date)) {
      return show.date === currentDay; // Only show today's weekly shows
    }
    // Only show dated shows that haven't passed
    return !hasDatePassed(show.date);
  });
};

// Get next 3 upcoming shows for hero section
export const getNextThreeShows = (shows: Show[]): Show[] => {
  const filteredShows = getFilteredShows(shows);
  
  // Sort shows: dated shows first (by date), then weekly shows (by day order)
  const sortedShows = [...filteredShows].sort((a, b) => {
    const aIsDated = !isDayOfWeek(a.date);
    const bIsDated = !isDayOfWeek(b.date);
    
    if (aIsDated && !bIsDated) return -1; // Dated shows come first
    if (!aIsDated && bIsDated) return 1;  // Weekly shows come after
    
    if (aIsDated && bIsDated) {
      // Sort dated shows by date
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    
    // Sort weekly shows by day order
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.indexOf(a.date) - days.indexOf(b.date);
  });
  
  return sortedShows.slice(0, 3);
};
