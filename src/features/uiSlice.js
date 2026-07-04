import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { isDialogOpen: false },
  reducers: {
    openDialog: (state) => { state.isDialogOpen = true; },
    closeDialog: (state) => { state.isDialogOpen = false; }
  }
});

export const { openDialog, closeDialog } = uiSlice.actions;
export default uiSlice.reducer;
