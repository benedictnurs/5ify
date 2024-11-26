export interface Task {
    _id: string;
    text: string;
    completed: boolean;
    subtasks: Task[];
    collapsed: boolean;
  }
  
  export const generateSubtasks = async (
    subtaskFlatten: string,
    intensity: number,
    task: string,
    count: number
  ): Promise<string[]> => {
    try {
      const response = await fetch('/api/generate-subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, subtaskFlatten , count, intensity }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch subtasks');
      }
  
      const data = await response.json();
      return data.subtasks;
    } catch (error) {
      console.error('Error generating subtasks:', error);
      return [];
    }
  };
  