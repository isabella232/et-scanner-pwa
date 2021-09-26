import React, {useEffect, useState} from "react";
import {AppBar, Button, Container, Grid, ListItemText, TextField, Toolbar, Typography} from '@material-ui/core';
import QrReader from 'react-qr-reader';

function Scanner() {

    const [result, setResult] = useState('');
    const [delay, setDelay] = useState( 1000 );
    const [show, setShow] = useState( false );

    const stored_api = typeof localStorage.getItem( 'api_key' ) !== 'undefined' ? localStorage.getItem( 'api_key' ) : '';
    const [api, setApi] = useState( stored_api );


    let handleScan = data => {
        console.log(data);
        if (data) {
            setResult(data);
            setDelay(false);
        }
    };

    let handleError = data => {
        console.log(data);
    };

    let reScan = () => {
        console.log('disable');
        setDelay(false);
        setShow(false);
    };

   useEffect( () => {
       if ( ! api ) {
           return;
       }

       if ( api.length > 5 ) {
           setShow(true);
           localStorage.setItem( 'api_key', api );
       } else {
           setShow(false);
       }
   }, [ api ] );

    return (
        <Container maxWidth='sm'>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={5}
            >
                <AppBar position='static'>
                    <Toolbar>
                        <Typography>Event Tickets Scanner PWA v0.1a</Typography>
                    </Toolbar>
                </AppBar>
                <Grid item xs={8}>
                    <TextField
                        id="outlined-basic"
                        label="API Key"
                        variant="outlined"
                        value={api}
                        onChange={(e) => setApi(e.target.value)}
                    />
                </Grid>
            </Grid>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                rowSpacing={5}
                columnspacing={100}
            >
                { show &&
                <QrReader
                    delay={delay}
                    onError={handleError}
                    onScan={handleScan}
                    style={{width: '100%'}}
                />
                }
                <p>Result: {result}</p>
                <Button onClick={reScan}> Rescan </Button>
            </Grid>
        </Container>
    );
}
export default Scanner;