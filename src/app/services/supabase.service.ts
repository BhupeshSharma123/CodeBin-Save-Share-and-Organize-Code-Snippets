import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SnipAI {
  id?: string;
  title: string;
  code: string;
  language: string;
  user_id: string;
  tags?: string[];
  description?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );

    // Set up auth state listener
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.next(session?.user ?? null);
    });
  }

  get user$(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  getCurrentUser() {
    return this.supabase.auth.getUser();
  }

  // SnipAI  methods
  async createCodeBin(bin: Omit<SnipAI, 'user_id' | 'id'>): Promise<SnipAI> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('codebins')
      .insert({
        ...bin,
        user_id: user.data.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCodeBin(id: string, updates: Partial<SnipAI>): Promise<SnipAI> {
    const { data, error } = await this.supabase
      .from('codebins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCodeBin(id: string): Promise<SnipAI> {
    const { data, error } = await this.supabase
      .from('codebins')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getUserCodeBins(): Promise<SnipAI[]> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    const { data, error } = await this.supabase
      .from('codebins')
      .select()
      .eq('user_id', user.data.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async deleteCodeBin(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('codebins')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async updateSnippet(id: string, data: any) {
    const { error } = await this.supabase
      .from('snippets')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  async createSnippet(data: Omit<SnipAI, 'user_id' | 'id'>): Promise<SnipAI> {
    const user = await this.supabase.auth.getUser();
    if (!user.data.user) throw new Error('User not authenticated');

    const { data: snippet, error } = await this.supabase
      .from('snippets')
      .insert({
        ...data,
        user_id: user.data.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return snippet;
  }

  async getSnippetById(id: string): Promise<SnipAI> {
    const { data, error } = await this.supabase
      .from('snippets')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select()
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data };
  }

  async updateProfile(profile: any) {
    const { error } = await this.supabase.from('profiles').upsert(profile);

    if (error) throw error;
    return true;
  }

  async getUserStats(userId: string) {
    const { data: snippets, error } = await this.supabase
      .from('snippets')
      .select('language, created_at')
      .eq('user_id', userId);

    if (error) throw error;

    // Calculate stats
    const stats = {
      totalSnippets: snippets.length,
      lastActive:
        snippets.length > 0
          ? new Date(
              Math.max(...snippets.map((s) => new Date(s.created_at).getTime()))
            )
          : new Date(),
      favoriteLanguage:
        snippets.length > 0
          ? Object.entries(
              snippets.reduce((acc, curr) => {
                acc[curr.language] = (acc[curr.language] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).sort((a, b) => b[1] - a[1])[0][0]
          : '',
    };

    return stats;
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }

  async deleteAccount(userId: string) {
    // First delete user data
    const { error: dataError } = await this.supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (dataError) throw dataError;

    // Then delete auth user
    const { error: authError } = await this.supabase.auth.admin.deleteUser(
      userId
    );
    if (authError) throw authError;

    return true;
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }
}
