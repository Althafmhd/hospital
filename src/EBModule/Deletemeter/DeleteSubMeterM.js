import React, { useState } from 'react';
import { Modal, Button, Typography } from '@mui/material';

const DeleteSubMeterM = ({ open, handleClose, handleDelete }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', margin: 'auto', maxWidth: '400px', top: '30%', position: 'absolute' }}>
                <Typography variant="h6">Confirm Deletion</Typography>
                <Typography>Are you sure you want to delete this meter?</Typography>
                <Button onClick={handleDelete} color="primary">Delete</Button>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
            </div>
        </Modal>
    );
};
export default DeleteSubMeterM;