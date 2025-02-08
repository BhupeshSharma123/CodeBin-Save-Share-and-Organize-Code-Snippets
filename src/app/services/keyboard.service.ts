import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export interface ShortcutCommand {
  key: string;
  command: string;
  description: string;
  action: () => void;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  private shortcuts: ShortcutCommand[] = [];

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) {
    this.initializeShortcuts();
  }

  private initializeShortcuts() {
    this.shortcuts = [
      {
        key: 'n',
        ctrl: true,
        command: 'Ctrl + N',
        description: 'New Snippet',
        action: () => this.router.navigate(['/bin'])
      },
      {
        key: '/',
        ctrl: true,
        command: 'Ctrl + /',
        description: 'Toggle AI Assistant',
        action: () => document.querySelector<HTMLElement>('[data-ai-toggle]')?.click()
      },
      {
        key: 's',
        ctrl: true,
        command: 'Ctrl + S',
        description: 'Save Snippet',
        action: () => document.querySelector<HTMLElement>('[data-save-snippet]')?.click()
      },
      {
        key: 'f',
        ctrl: true,
        command: 'Ctrl + F',
        description: 'Search Snippets',
        action: () => document.querySelector<HTMLElement>('[data-search-input]')?.focus()
      },
      {
        key: 'h',
        ctrl: true,
        command: 'Ctrl + H',
        description: 'Show Shortcuts Help',
        action: () => this.showShortcutsHelp()
      }
    ];
  }

  handleKeyPress(event: KeyboardEvent) {
    const shortcut = this.shortcuts.find(s => 
      s.key === event.key.toLowerCase() &&
      !!s.ctrl === event.ctrlKey &&
      !!s.alt === event.altKey &&
      !!s.shift === event.shiftKey
    );

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  showShortcutsHelp() {
    const shortcuts = this.shortcuts.map(s => 
      `${s.command}: ${s.description}`
    ).join('\n');

    this.toastr.info(shortcuts, 'Keyboard Shortcuts', {
      timeOut: 5000,
      enableHtml: true,
      positionClass: 'toast-bottom-right'
    });
  }

  getShortcuts(): ShortcutCommand[] {
    return this.shortcuts;
  }
} 