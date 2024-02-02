// component to display attendee data.
import React, { useState } from 'react';
import {
    AppBar,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    makeStyles,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core';

function Attendee( { attendeeData } ) {
    const useStyles = makeStyles({
        card: {
            width: '100%',
            marginTop: '20px',
            marginBottom: '20px',
            backgroundColor: '#f0f0f0',
        },

        label: {
            fontWeight: 'bold',
        }
    });

    function InfoCard({ attendee }) {
        const classes = useStyles();
        return (
            <Card className={classes.card}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {attendee.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                        <label className={classes.label}>Email: </label> {attendee.email || 'N/A'}
                    </Typography>
                    <Typography color="textSecondary">
                        <label className={classes.label}>Ticket: </label> {attendee.ticket || 'N/A'}
                    </Typography>
                    { attendee.information &&
                        Object.entries(attendee.information).map(([key, value], index) => (
                            <Typography key={index} color="textSecondary">
                                <label className={classes.label}>{key}: </label> {value || 'N/A'}
                            </Typography>
                        ))
                    }
                </CardContent>
            </Card>
        );
    }

    return (
        <InfoCard attendee={attendeeData}/>
    );
}

export default Attendee;