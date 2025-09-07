import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Shield, 
  Users as UsersIcon,
  Calendar,
  Mail,
  Crown,
  User,
  UserPlus,
  Ban,
  CheckCircle,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { AnalyticsCard } from '@/components/admin/AnalyticsCard';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'moderator' | 'user' | 'owner';
  status?: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

const Users = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserFullName, setNewUserFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'moderator'>('admin');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isOwner, isAdmin, isModerator, canManageUsers } = useAuth();

  // Fetch users with search and filters
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users', searchTerm, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      }

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter as 'admin' | 'moderator' | 'user');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as UserProfile[];
    },
  });

  // Fetch user statistics
  const { data: userStats } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: async () => {
      const [totalResult, adminResult, moderatorResult, recentResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'admin'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'moderator'),
        supabase.from('profiles').select('id', { count: 'exact' }).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        total: totalResult.count || 0,
        admins: adminResult.count || 0,
        moderators: moderatorResult.count || 0,
        recent: recentResult.count || 0
      };
    },
  });


  // Suspend/unsuspend user mutation (only for owners)
  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, newStatus }: { userId: string; newStatus: 'active' | 'suspended' }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: "User status updated",
        description: "The user's status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation (only for owners)
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
      toast({
        title: "User deleted",
        description: "The user has been successfully removed from the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add new user mutation (only for owners)
  const addUserMutation = useMutation({
    mutationFn: async ({ email, password, fullName, role }: { 
      email: string; 
      password: string; 
      fullName: string; 
      role: 'admin' | 'moderator'
    }) => {
      // Create user account through regular signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { full_name: fullName }
        }
      });

      if (authError) throw authError;

      // Manually create the profile for the new user as owner
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: email,
            full_name: fullName,
            role: role,
            status: 'active'
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          throw profileError;
        }
      }

      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-stats'] });
      setIsAddDialogOpen(false);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserFullName('');
      setNewUserRole('admin');
      toast({
        title: "User created successfully",
        description: "New user has been added to the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddUser = () => {
    if (!newUserEmail || !newUserPassword || !newUserFullName) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    addUserMutation.mutate({
      email: newUserEmail,
      password: newUserPassword,
      fullName: newUserFullName,
      role: newUserRole
    });
  };


  const canSuspendUser = (targetRole: string, targetUserId: string) => {
    // Owner cannot suspend themselves
    if (user?.id === targetUserId) return false;
    if (isOwner) return true; // Owner can suspend anyone else
    // Admin can suspend users and moderators, but NOT other admins
    if (isAdmin && (targetRole === 'user' || targetRole === 'moderator')) return true;
    // Moderator can suspend users
    if (isModerator && targetRole === 'user') return true;
    return false;
  };

  const canDeleteUser = (targetRole: string, targetUserId: string) => {
    // Owner cannot delete themselves
    if (user?.id === targetUserId) return false;
    if (isOwner) return true; // Owner can delete anyone else
    // Admin can only delete moderators
    if (isAdmin && targetRole === 'moderator') return true;
    return false;
  };


  const handleToggleUserStatus = (userId: string, currentStatus: string, userRole: string) => {
    if (!canSuspendUser(userRole, userId)) return;
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    toggleUserStatusMutation.mutate({ userId, newStatus: newStatus as 'active' | 'suspended' });
  };

  const handleDeleteUser = (userId: string, userRole: string, userName: string) => {
    if (!canDeleteUser(userRole, userId)) return;
    
    if (window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-gradient-primary text-white';
      case 'admin':
        return 'bg-gradient-danger text-white';
      case 'moderator':
        return 'bg-gradient-warning text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return Crown;
      case 'admin':
        return Shield;
      case 'moderator':
        return UserCheck;
      default:
        return User;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        
        {canManageUsers && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with the specified role.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={newUserFullName}
                  onChange={(e) => setNewUserFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                 <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as 'admin' | 'moderator')}>
                   <SelectTrigger>
                     <SelectValue />
                   </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleAddUser}
                disabled={addUserMutation.isPending}
              >
                {addUserMutation.isPending ? 'Creating...' : 'Create User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          title="Total Users"
          value={userStats?.total || 0}
          description="All registered users"
          icon={UsersIcon}
          variant="primary"
        />
        <AnalyticsCard
          title="Administrators"
          value={userStats?.admins || 0}
          description="Users with admin privileges"
          icon={Crown}
          variant="danger"
        />
        <AnalyticsCard
          title="Moderators"
          value={userStats?.moderators || 0}
          description="Users with moderation rights"
          icon={Shield}
          variant="warning"
        />
        <AnalyticsCard
          title="New This Week"
          value={userStats?.recent || 0}
          description="Recently registered users"
          icon={UserCheck}
          variant="success"
        />
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrators</SelectItem>
                <SelectItem value="moderator">Moderators</SelectItem>
                <SelectItem value="user">Regular Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users table */}
      <Card>
        <CardHeader>
          <CardTitle>User Accounts</CardTitle>
          <CardDescription>
            Manage user roles and view account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-32" />
                      <div className="h-3 bg-muted rounded w-48" />
                    </div>
                  </div>
                  <div className="h-8 bg-muted rounded w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {users?.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {(user.full_name || user.email).split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {user.full_name || 'No name set'}
                          </h3>
                          <Badge className={getRoleColor(user.role)}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          {user.status === 'suspended' && (
                            <Badge variant="destructive">
                              <Ban className="h-3 w-3 mr-1" />
                              Suspended
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                     <div className="flex items-center gap-2">
                       {canSuspendUser(user.role, user.id) && (
                         <Button
                           variant={user.status === 'suspended' ? 'default' : 'outline'}
                           size="sm"
                           onClick={() => handleToggleUserStatus(user.id, user.status || 'active', user.role)}
                           disabled={toggleUserStatusMutation.isPending}
                           className="gap-1"
                         >
                           {user.status === 'suspended' ? (
                             <>
                               <CheckCircle className="h-3 w-3" />
                               Activate
                             </>
                           ) : (
                             <>
                               <Ban className="h-3 w-3" />
                               Suspend
                             </>
                           )}
                         </Button>
                       )}

                       {canDeleteUser(user.role, user.id) && (
                         <Button
                           variant="destructive"
                           size="sm"
                           onClick={() => handleDeleteUser(user.id, user.role, user.full_name || user.email)}
                           disabled={deleteUserMutation.isPending}
                           className="gap-1"
                         >
                           <Trash2 className="h-3 w-3" />
                           Delete
                         </Button>
                       )}
                       
                       {!canSuspendUser(user.role, user.id) && !canDeleteUser(user.role, user.id) && (
                         <Badge variant="outline" className="px-3 py-1">
                           {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                         </Badge>
                       )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && (!users || users.length === 0) && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No users found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || roleFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No users have registered yet.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;