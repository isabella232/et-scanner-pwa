import React, {useEffect, useState} from "react";
import {
    AppBar,
    Button,
    Container,
    Grid,
    Menu,
    TextField,
    Toolbar,
    Typography,
    IconButton,
    makeStyles
} from '@material-ui/core';
import QrReader from 'react-qr-reader';
import { parseUrl, stringify } from 'query-string';

function Scanner() {

    const [result, setResult] = useState('');
    const [delay, setDelay] = useState( 1000 );
    const [showQR, setshowQR] = useState( false );

    const stored_api = typeof localStorage.getItem( 'api_key' ) !== 'undefined' ? localStorage.getItem( 'api_key' ) : '';
    const [api, setApi] = useState( stored_api );

    const gridStyle = {
        marginTop: 20,
    }

    let handleScan = data => {
        if (data) {
            setResult( 'Loading...' );
            setDelay(false);
            setshowQR(false);
            scanTicket( data );
        }
    };

    let handleError = data => {
        console.log(data);
    };

    let reScan = () => {
        setDelay( 1000 );
        setshowQR( ! showQR );
    };

   useEffect( () => {
       if ( ! api ) {
           return;
       }

       if ( api.length > 5 ) {
           setshowQR(true);
           localStorage.setItem( 'api_key', api );
       } else {
           setshowQR(false);
       }
   }, [ api ] );

    const getCheckInUrl = (scanUrl) => {
        const { url, query } = parseUrl(scanUrl);
        /* eslint-disable camelcase */
        const { ticket_id, event_id, path, security_code } = query;
        const endpoint = `${url}${path || this.endpoint}`;
        const params = stringify({ ticket_id, event_id, security_code });
        /* eslint-enable camelcase */
        return `${endpoint}?${params}`;
    }

   let scanTicket = ( data ) => {
        const checkInUrl = getCheckInUrl( data );

        console.log(checkInUrl);
        const apiParam = stringify({ api_key: api });
        const apiURL = `${checkInUrl}&${apiParam}`;

        console.log(apiURL);

        fetch(apiURL)
           .then(res => res.json())
           .then(
               (result) => {
                   console.log( result );
                   if ( result.msg ) {
                       setResult( result.msg );
                   } else {
                       setResult( 'Invalid API Key!' );
                   }
               },
               // Note: it's important to handle errors here
               // instead of a catch() block so that we don't swallow
               // exceptions from actual bugs in components.
               (error) => {
                   console.log( error );
                   setResult( 'Event website is not reachable!' );
               }
           )
   }

    return (
        <Container maxWidth='sm'>
            <AppBar position="static">
                <Toolbar variant="dense">
                    {/*<IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>*/}
                    {/*    <Menu />*/}
                    {/*</IconButton>*/}
                    <Typography variant="h6" color="inherit" component="div">
                        Event Tickets Scanner
                    </Typography>
                </Toolbar>
            </AppBar>

            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={5}
                style={gridStyle}
            >
                <Grid item sm>
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
                <h2> Scan Ticket </h2>
                { showQR &&
                <QrReader
                    delay={delay}
                    onError={handleError}
                    onScan={handleScan}
                    style={{width: '100%'}}
                />
                }

                <h3>{result}</h3>

                { !showQR &&
                    <Button variant="contained" onClick={reScan}> Scan again </Button>
                }
            </Grid>
        </Container>
    );
}
export default Scanner;