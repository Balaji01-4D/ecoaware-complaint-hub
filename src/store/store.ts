
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import complaintReducer from './slices/complaintSlice';
import adminComplaintReducer from './slices/adminComplaintSlice';
import categoryReducer from './slices/categorySlice';
import adminUsersReducer from './slices/adminUsersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintReducer,
    adminComplaints: adminComplaintReducer,
    categories: categoryReducer,
    adminUsers: adminUsersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
