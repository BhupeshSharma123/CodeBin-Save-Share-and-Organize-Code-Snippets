import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SnipAI {
  is_public: any;
  id?: string;
  title: string;
  code: string;
  language: string;
  category: string;
  user_id: string;
  tags?: string[];
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  category: string;
}

export interface ShareableLink {
  id: string;
  code_bin_id: string;
  access_token: string;
  expires_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  [x: string]: any;
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
  async createCodeBin(bin: SnipAI): Promise<SnipAI> {
    const { data, error } = await this.supabase
      .from('code_bins')
      .insert([bin])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCodeBin(id: string, bin: SnipAI): Promise<SnipAI> {
    const { data, error } = await this.supabase
      .from('code_bins')
      .update(bin)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCodeBin(id: string): Promise<SnipAI> {
    const { data, error } = await this.supabase
      .from('code_bins')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Snippet not found');

    return data;
  }

  async getUserCodeBins(): Promise<SnipAI[]> {
    const { data, error } = await this.supabase
      .from('code_bins')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async deleteCodeBin(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('code_bins')
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

  async shareCodeBin(binId: string, isPublic: boolean = true) {
    const { data, error } = await this.supabase
      .from('code_bins')
      .update({ is_public: isPublic })
      .eq('id', binId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPublicCodeBin(id: string): Promise<SnipAI> {
    const { data, error } = await this.supabase
      .from('code_bins')
      .select()
      .eq('id', id)
      .eq('is_public', true)
      .single();

    if (error) throw error;
    return data;
  }

  async createVersion(codeBinId: string, code: string, comment?: string) {
    // Get the latest version number
    const { data: versions } = await this.supabase
      .from('code_bin_versions')
      .select('version_number')
      .eq('code_bin_id', codeBinId)
      .order('version_number', { ascending: false })
      .limit(1);

    const nextVersion = versions?.length ? versions[0].version_number + 1 : 1;

    const { data, error } = await this.supabase
      .from('code_bin_versions')
      .insert({
        code_bin_id: codeBinId,
        version_number: nextVersion,
        code,
        comment,
        created_by: (await this.getCurrentUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVersions(codeBinId: string) {
    const { data, error } = await this.supabase
      .from('code_bin_versions')
      .select(
        `
        id,
        version_number,
        code,
        created_at,
        comment,
        created_by
      `
      )
      .eq('code_bin_id', codeBinId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return data;
  }

  async saveTemplate(template: CodeTemplate): Promise<void> {
    const { error } = await this.supabase.from('templates').insert([template]);

    if (error) throw error;
  }

  async getCustomTemplates(): Promise<CodeTemplate[]> {
    const { data, error } = await this.supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createShareableLink(
    codeBinId: string,
    expiresInDays = 7
  ): Promise<string> {
    const accessToken = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    const { data, error } = await this.supabase
      .from('shareable_links')
      .insert({
        code_bin_id: codeBinId,
        access_token: accessToken,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return `${window.location.origin}/share/${accessToken}`;
  }

  async getSharedCodeBin(accessToken: string): Promise<SnipAI> {
    const { data: linkData, error: linkError } = await this.supabase
      .from('shareable_links')
      .select('code_bin_id, expires_at')
      .eq('access_token', accessToken)
      .single();

    if (linkError) throw new Error('Invalid or expired link');
    if (new Date(linkData.expires_at) < new Date()) {
      throw new Error('Link has expired');
    }

    const { data: binData, error: binError } = await this.supabase
      .from('code_bins')
      .select()
      .eq('id', linkData.code_bin_id)
      .single();

    if (binError) throw new Error('Code bin not found');
    return binData;
  }
}
