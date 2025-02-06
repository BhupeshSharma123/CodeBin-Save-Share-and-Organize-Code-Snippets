@Component({
  selector: 'app-dashboard',
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm">
        <div class="container mx-auto px-4 py-6">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Developer Dashboard</h1>
        </div>
      </header>

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-8">
        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Projects</h3>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ totalProjects }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Generated Code</h3>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ generatedCode }}K</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Tests Passed</h3>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ testsPassed }}%</p>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Time Saved</h3>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">{{ timeSaved }}h</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div class="space-y-4">
              <div *ngFor="let activity of recentActivity" class="flex items-center">
                <div [class]="'w-10 h-10 rounded-lg flex items-center justify-center ' + activity.bgColor">
                  <svg class="w-5 h-5" [class]="activity.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor" [innerHTML]="activity.icon"></svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ activity.timestamp | date:'medium' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button *ngFor="let action of quickActions" 
            class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left">
            <div class="flex items-center">
              <div [class]="'w-12 h-12 rounded-lg flex items-center justify-center ' + action.bgColor">
                <svg class="w-6 h-6" [class]="action.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor" [innerHTML]="action.icon"></svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ action.title }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ action.description }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  totalProjects = 12;
  generatedCode = 25;
  testsPassed = 98;
  timeSaved = 45;

  recentActivity = [
    {
      title: 'Generated API endpoints',
      timestamp: new Date(),
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />'
    },
    // Add more activities...
  ];

  quickActions = [
    {
      title: 'New Project',
      description: 'Create a new AI-powered project',
      bgColor: 'bg-green-100 dark:bg-green-900',
      iconColor: 'text-green-600 dark:text-green-400',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />'
    },
    // Add more actions...
  ];

  constructor() {}

  ngOnInit() {
    // Initialize dashboard data
  }
} 