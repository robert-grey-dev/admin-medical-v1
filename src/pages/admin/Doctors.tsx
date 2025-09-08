import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { 
  Search, 
  Plus, 
  Star, 
  MessageSquare, 
  Edit, 
  Trash2,
  Stethoscope,
  MapPin,
  Calendar,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  description?: string;
  image_url?: string;
  experience_years?: number;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [addImageUrl, setAddImageUrl] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch doctors with search
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['admin-doctors', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('doctors')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Doctor[];
    },
  });

  // Add doctor mutation
  const addDoctorMutation = useMutation({
    mutationFn: async (doctorData: Omit<Doctor, 'id' | 'created_at' | 'updated_at' | 'average_rating' | 'total_reviews'>) => {
      const { data, error } = await supabase
        .from('doctors')
        .insert([doctorData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-doctors'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Doctor added successfully",
        description: "The new doctor has been added to the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding doctor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Edit doctor mutation
  const editDoctorMutation = useMutation({
    mutationFn: async ({ id, doctorData }: { id: string; doctorData: Partial<Doctor> }) => {
      const { data, error } = await supabase
        .from('doctors')
        .update(doctorData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-doctors'] });
      setIsEditDialogOpen(false);
      setSelectedDoctor(null);
      toast({
        title: "Doctor updated successfully",
        description: "The doctor information has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating doctor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete doctor mutation
  const deleteDoctorMutation = useMutation({
    mutationFn: async (doctorId: string) => {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', doctorId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-doctors'] });
      toast({
        title: "Doctor removed",
        description: "The doctor has been removed from the system.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing doctor",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddDoctor = (formData: FormData) => {
    const doctorData = {
      name: formData.get('name') as string,
      specialty: formData.get('specialty') as string,
      description: formData.get('description') as string || undefined,
      image_url: addImageUrl || undefined,
      experience_years: parseInt(formData.get('experience_years') as string) || undefined,
    };

    addDoctorMutation.mutate(doctorData);
  };

  const handleEditDoctor = (formData: FormData) => {
    if (!selectedDoctor) return;
    
    const doctorData = {
      name: formData.get('name') as string,
      specialty: formData.get('specialty') as string,
      description: formData.get('description') as string || undefined,
      image_url: editImageUrl || selectedDoctor.image_url,
      experience_years: parseInt(formData.get('experience_years') as string) || undefined,
    };

    editDoctorMutation.mutate({ id: selectedDoctor.id, doctorData });
  };

  const handleDeleteDoctor = (doctorId: string) => {
    if (confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      deleteDoctorMutation.mutate(doctorId);
    }
  };

  const openEditDialog = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setEditImageUrl(doctor.image_url || null);
    setIsEditDialogOpen(true);
  };

  const resetAddForm = () => {
    setAddImageUrl(null);
    setIsAddDialogOpen(false);
  };

  const resetEditForm = () => {
    setEditImageUrl(null);
    setSelectedDoctor(null);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doctors Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage medical professionals in your system
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => open ? setIsAddDialogOpen(true) : resetAddForm()}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
              <DialogDescription>
                Add a new medical professional to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleAddDoctor(formData);
            }} className="space-y-6">
              
              <ImageUpload
                value={addImageUrl}
                onChange={setAddImageUrl}
                bucket="doctor-images"
                folder="profiles"
                disabled={addDoctorMutation.isPending}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    placeholder="Cardiology"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience_years">Years of Experience</Label>
                <Input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  min="0"
                  placeholder="10"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of the doctor's expertise..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetAddForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addDoctorMutation.isPending}>
                  {addDoctorMutation.isPending ? 'Adding...' : 'Add Doctor'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Doctor Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => open ? setIsEditDialogOpen(true) : resetEditForm()}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Doctor</DialogTitle>
              <DialogDescription>
                Update the doctor's information.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleEditDoctor(formData);
            }} className="space-y-6">
              
              <ImageUpload
                value={editImageUrl}
                onChange={setEditImageUrl}
                bucket="doctor-images"
                folder="profiles"
                disabled={editDoctorMutation.isPending}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    placeholder="Dr. John Smith"
                    defaultValue={selectedDoctor?.name || ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-specialty">Specialty</Label>
                  <Input
                    id="edit-specialty"
                    name="specialty"
                    placeholder="Cardiology"
                    defaultValue={selectedDoctor?.specialty || ''}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-experience_years">Years of Experience</Label>
                <Input
                  id="edit-experience_years"
                  name="experience_years"
                  type="number"
                  min="0"
                  placeholder="10"
                  defaultValue={selectedDoctor?.experience_years || ''}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  placeholder="Brief description of the doctor's expertise..."
                  rows={3}
                  defaultValue={selectedDoctor?.description || ''}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetEditForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editDoctorMutation.isPending}>
                  {editDoctorMutation.isPending ? 'Updating...' : 'Update Doctor'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search doctors by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Doctors grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-24" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {doctors?.map((doctor) => (
            <Card key={doctor.id} className="transition-all duration-300 hover:shadow-card-hover group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={doctor.image_url} alt={doctor.name} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {doctor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{doctor.name}</h3>
                      <p className="text-muted-foreground text-sm">{doctor.specialty}</p>
                      {doctor.experience_years && (
                        <Badge variant="secondary" className="mt-1 gap-1">
                          <Award className="h-3 w-3" />
                          {doctor.experience_years} years
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                   <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button 
                       size="sm" 
                       variant="ghost" 
                       className="h-8 w-8 p-0"
                       onClick={() => openEditDialog(doctor)}
                     >
                       <Edit className="h-4 w-4" />
                     </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteDoctor(doctor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {doctor.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {doctor.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{doctor.average_rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>{doctor.total_reviews}</span>
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(doctor.created_at).toLocaleDateString()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && (!doctors || doctors.length === 0) && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Stethoscope className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold">No doctors found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first doctor.'}
                </p>
              </div>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add First Doctor
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Doctors;
