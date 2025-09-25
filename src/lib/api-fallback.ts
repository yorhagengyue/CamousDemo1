// Production API fallback for when MSW is not available
import { dashboardByRole, principalDashboard, enrolmentOverview, leaveOverview, messageThreads } from "@/fixtures/data";

// Create a simple API client that returns static data in production
export class ApiFallback {
  private static instance: ApiFallback;
  
  static getInstance(): ApiFallback {
    if (!ApiFallback.instance) {
      ApiFallback.instance = new ApiFallback();
    }
    return ApiFallback.instance;
  }

  async get<T>(url: string): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
    
    const path = url.replace(/^.*\/api\//, '/api/');
    
    switch (path) {
      case '/api/dashboard/student':
        return dashboardByRole.student as T;
      case '/api/dashboard/teacher':
        return dashboardByRole.teacher as T;
      case '/api/dashboard/hod':
        return dashboardByRole.hod as T;
      case '/api/dashboard/principal':
        return principalDashboard as T;
      case '/api/dashboard/admin':
        return dashboardByRole.admin as T;
      case '/api/enrolment':
        return enrolmentOverview as T;
      case '/api/leave':
        return leaveOverview as T;
      case '/api/messages':
        // Parse query parameters
        const urlObj = new URL(url);
        const page = Number(urlObj.searchParams.get('page') || '1');
        const pageSize = Number(urlObj.searchParams.get('pageSize') || '10');
        const unreadOnly = urlObj.searchParams.get('unreadOnly') === 'true';
        
        let filteredMessages = [...messageThreads];
        if (unreadOnly) {
          filteredMessages = filteredMessages.filter(msg => !msg.isRead);
        }
        
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        
        return {
          data: filteredMessages.slice(start, end),
          page,
          pageSize,
          total: filteredMessages.length
        } as T;
      default:
        throw new Error(`API endpoint not found: ${path}`);
    }
  }

  async post<T>(url: string, _data?: any): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    const path = url.replace(/^.*\/api\//, '/api/');
    
    switch (path) {
      case '/api/enrolment':
        return { success: true, message: 'Enrolled successfully' } as T;
      case '/api/leave':
        return { success: true, message: 'Leave request submitted' } as T;
      case '/api/messages':
        return { success: true, message: 'Message sent successfully' } as T;
      default:
        throw new Error(`API endpoint not found: ${path}`);
    }
  }

  async patch<T>(url: string, _data?: any): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 250));
    
    const path = url.replace(/^.*\/api\//, '/api/');
    
    switch (path) {
      case '/api/messages/':
        return { success: true, message: 'Message updated' } as T;
      case '/api/leave/':
        return { success: true, message: 'Leave request updated' } as T;
      default:
        throw new Error(`API endpoint not found: ${path}`);
    }
  }
}

// Check if we're in production and MSW is not available
export function shouldUseFallback(): boolean {
  return import.meta.env.PROD && !(window as any).__MSW_AVAILABLE__;
}

// Create a fetch wrapper that uses fallback in production
export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  if (shouldUseFallback()) {
    const api = ApiFallback.getInstance();
    
    if (options?.method === 'POST') {
      return api.post<T>(url, options.body ? JSON.parse(options.body as string) : undefined);
    } else if (options?.method === 'PATCH') {
      return api.patch<T>(url, options.body ? JSON.parse(options.body as string) : undefined);
    } else {
      return api.get<T>(url);
    }
  }
  
  // Use normal fetch in development or when MSW is available
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
