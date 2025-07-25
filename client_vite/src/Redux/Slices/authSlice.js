import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev';

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userCredObj, { rejectWithValue }) => {
    try {
      if (!userCredObj) {
        return rejectWithValue('No credentials provided');
      }
      const res = await axios.post(`${API_URL}/user/login`, userCredObj, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.data.message === 'login successful') {
        localStorage.setItem('Token', res.data.Token); // Changed to localStorage
        localStorage.setItem('currentUser', JSON.stringify(res.data.data));
        localStorage.setItem('loginStatus', 'true');
        return res.data.data;
      } else {
        return rejectWithValue(res.data.message);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        return rejectWithValue('User not found. Please register first.');
      } else if (err.response?.status === 401) {
        return rejectWithValue('Incorrect password');
      }
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for user logout (client-side only)
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
    console.log('Logging out user...');
    localStorage.removeItem('Token'); // Changed to localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginStatus');
    try {
      dispatch(resetState()); // Clear client-side state
      return { message: 'Logout successful' };
    } catch (err) {
      return rejectWithValue('Logout failed: ' + err.message);
    }
  }
);

// Async thunk for fetching mentors
export const fetchMentors = createAsyncThunk(
  'auth/fetchMentors',
  async ({ searchQuery, selectedFilter, ratingFilter, priceFilter }, { rejectWithValue }) => {
    try {
      const params = {};
      if (selectedFilter !== 'all') {
        params.isOnline = selectedFilter === 'online';
      }
      if (searchQuery) {
        params.skills = searchQuery;
      }
      if (ratingFilter !== 'all') {
        params.rating = ratingFilter.replace('+', '');
      }
      if (priceFilter !== 'all') {
        if (priceFilter === 'under-50') params.price = '0-50';
        else if (priceFilter === '50-60') params.price = '50-60';
        else if (priceFilter === 'above-60') params.price = '60';
      }
      const res = await axios.get(`${API_URL}/mentors`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`, // Changed to localStorage
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch mentors');
    }
  }
);

// Async thunk for fetching chat history
export const fetchChatHistory = createAsyncThunk(
  'auth/fetchChatHistory',
  async ({ userId, mentorShortName }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${API_URL}/mentors/${mentorShortName}/chat?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`, // Changed to localStorage
          },
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch chat history');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || {},
    loginStatus: localStorage.getItem('loginStatus') === 'true',
    mentors: [],
    selectedMentor: null,
    messages: [],
    isPending: false,
    errorOccured: false,
    errorMessage: '',
  },
  reducers: {
    resetState: (state) => {
      state.currentUser = {};
      state.loginStatus = false;
      state.mentors = [];
      state.selectedMentor = null;
      state.messages = [];
      state.isPending = false;
      state.errorOccured = false;
      state.errorMessage = '';
      localStorage.removeItem('currentUser');
      localStorage.removeItem('loginStatus');
      localStorage.removeItem('Token'); // Changed to localStorage
    },
    setSelectedMentor: (state, action) => {
      state.selectedMentor = action.payload;
      state.messages = [];
    },
    updateMentorStatus: (state, action) => {
      const { mentorId, isOnline } = action.payload;
      state.mentors = state.mentors.map((mentor) =>
        mentor._id === mentorId ? { ...mentor, isOnline } : mentor
      );
      if (state.selectedMentor?._id === mentorId) {
        state.selectedMentor.isOnline = isOnline;
      }
    },
    addMessage: (state, action) => {
      const message = action.payload;
      if (
        !state.messages.some(
          (msg) => msg.id === message._id?.toString() || msg.tempId === message.tempId
        )
      ) {
        state.messages.push({
          id: message._id?.toString(),
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          createdAt: new Date(message.timestamp || message.createdAt),
          isOwn: message.senderId === state.currentUser._id,
          senderName: message.senderId === state.currentUser._id ? 'You' : state.selectedMentor?.name || 'Mentor',
          tempId: message.tempId,
        });
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter((msg) => msg.tempId !== action.payload);
    },
    setError: (state, action) => {
      state.errorOccured = true;
      state.errorMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isPending = true;
        state.errorOccured = false;
        state.errorMessage = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isPending = false;
        state.loginStatus = true;
        state.currentUser = action.payload;
        state.errorOccured = false;
        state.errorMessage = '';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isPending = false;
        state.loginStatus = false;
        state.errorOccured = true;
        state.errorMessage = action.payload;
        state.currentUser = {};
      })
      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.isPending = true;
        state.errorOccured = false;
        state.errorMessage = '';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isPending = false;
        state.errorOccured = false;
        state.errorMessage = '';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isPending = false;
        state.errorOccured = true;
        state.errorMessage = action.payload;
      })
      // Fetch Mentors
      .addCase(fetchMentors.pending, (state) => {
        state.isPending = true;
        state.errorOccured = false;
        state.errorMessage = '';
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.isPending = false;
        state.mentors = action.payload;
        state.errorOccured = false;
        state.errorMessage = '';
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.isPending = false;
        state.errorOccured = true;
        state.errorMessage = action.payload;
      })
      // Fetch Chat History
      .addCase(fetchChatHistory.pending, (state) => {
        state.isPending = true;
        state.errorOccured = false;
        state.errorMessage = '';
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isPending = false;
        state.messages = action.payload.map((msg) => ({
          id: msg._id.toString(),
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          content: msg.content,
          createdAt: new Date(msg.createdAt),
          isOwn: msg.senderId === state.currentUser._id,
          senderName: msg.senderId === state.currentUser._id ? 'You' : state.selectedMentor?.name || 'Mentor',
        }));
        state.errorOccured = false;
        state.errorMessage = '';
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isPending = false;
        state.errorOccured = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetState, setSelectedMentor, updateMentorStatus, addMessage, removeMessage, setError } =
  authSlice.actions;

export default authSlice.reducer;