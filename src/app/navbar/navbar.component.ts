@Component({
  selector: 'app-navbar',
  template: `
    // ... existing navbar items ...
    <a
      routerLink="/snippets"
      routerLinkActive="active"
      class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      Snippet Storage
    </a>
    // ... rest of navbar ...
  `
}) 