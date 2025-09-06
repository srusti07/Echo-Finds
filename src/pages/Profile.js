import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: user?.username || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || ''
    }
  });

  const updateProfileMutation = useMutation(
    (profileData) => axios.put('/api/users/profile', profileData),
    {
      onSuccess: (response) => {
        toast.success('Profile updated successfully!');
        updateUser(response.data.user);
        queryClient.invalidateQueries('user');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const onSubmit = (data) => {
    updateProfileMutation.mutate(data);
  };

  return (
    <Box maxWidth="md" mx="auto">
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                margin="normal"
                {...register('firstName', {
                  maxLength: {
                    value: 50,
                    message: 'First name must be less than 50 characters'
                  }
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                margin="normal"
                {...register('lastName', {
                  maxLength: {
                    value: 50,
                    message: 'Last name must be less than 50 characters'
                  }
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              },
              maxLength: {
                value: 30,
                message: 'Username must be less than 30 characters'
              }
            })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />

          <TextField
            fullWidth
            label="Email"
            value={user?.email || ''}
            margin="normal"
            disabled
            helperText="Email cannot be changed"
          />

          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={4}
            margin="normal"
            {...register('bio', {
              maxLength: {
                value: 500,
                message: 'Bio must be less than 500 characters'
              }
            })}
            error={!!errors.bio}
            helperText={errors.bio?.message}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={updateProfileMutation.isLoading}
            sx={{ mt: 3 }}
          >
            {updateProfileMutation.isLoading ? (
              <CircularProgress size={24} />
            ) : (
              'Update Profile'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
