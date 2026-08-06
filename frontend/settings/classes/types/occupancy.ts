export interface SectionOccupancyReport {
  sectionId: string;
  sectionName: string;
  capacity: number;
  currentStudents: number;
  seatsLeft: number;
  occupancyPercentage: number;
}

export interface ClassOccupancyReport {
  classId: string;
  className: string;
  sectionsEnabled: boolean;
  totalCapacity: number;
  totalEnrolledStudents: number;
  totalSeatsLeft: number;
  sections: SectionOccupancyReport[];
}

export interface AutoAllocationResult {
  sectionId: string | null;
  sectionName: string | null;
  allocated: boolean;
  message: string;
}