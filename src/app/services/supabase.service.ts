import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CodeBin {
  id?: string;
  title: string;
  code: string;
  language: string;
  user_id: string;
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

  // CodeBin methods
  async createCodeBin(bin: Omit<CodeBin, 'user_id' | 'id'>): Promise<CodeBin> {
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

  async updateCodeBin(id: string, updates: Partial<CodeBin>): Promise<CodeBin> {
    const { data, error } = await this.supabase
      .from('codebins')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCodeBin(id: string): Promise<CodeBin> {
    const { data, error } = await this.supabase
      .from('codebins')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getUserCodeBins(): Promise<CodeBin[]> {
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
}
