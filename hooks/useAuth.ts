import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import toast from 'react-hot-toast'

export function useAuth() {
  const router = useRouter()
  const { user, profile, setUser, setProfile, isLoading, setIsLoading } = useAuthStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
        if (event === 'SIGNED_IN') {
          router.push('/chat')
        }
      } else {
        setProfile(null)
        setIsLoading(false)
        if (event === 'SIGNED_OUT') {
          router.push('/auth')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
      
      // Update status to online
      await supabase
        .from('profiles')
        .update({ status: 'online', last_seen: new Date().toISOString() })
        .eq('id', userId)
        
    } catch (error: any) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      toast.success('Welcome back!')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (authError) throw authError
      
      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            display_name: username,
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          })
        
        if (profileError) throw profileError
        toast.success('Account created successfully!')
      }
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const signOut = async () => {
    try {
      if (user) {
        // Update status to offline before signing out
        await supabase
          .from('profiles')
          .update({ status: 'offline', last_seen: new Date().toISOString() })
          .eq('id', user.id)
      }
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Signed out successfully')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  const updateProfile = async (updates: Partial<typeof profile>) => {
    if (!user) return
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
      
      if (error) throw error
      
      setProfile({ ...profile, ...updates } as any)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.message)
      throw error
    }
  }

  return {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}
