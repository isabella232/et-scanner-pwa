import React, {useEffect, useState} from "react";
import {
    AppBar,
    Button, CircularProgress,
    Container,
    Grid,
    TextField,
    Toolbar,
    Typography,
} from '@material-ui/core';
import QrReader from 'react-qr-reader';
import { parseUrl, stringify } from 'query-string';
import Attendee from "./Attendee";

function Scanner() {

    const version = 'v0.3';
    const [result, setResult] = useState('');
    const [delay, setDelay] = useState( 1000 );
    const [showQR, setshowQR] = useState( false );
    const [showInfo, setshowInfo] = useState( false );
    const [attendeeData, setattendeeData] = useState({});
    const [loader, setLoader] = useState( false );
    const [apiInput, setApiInput] = useState( true );

    const stored_api = typeof localStorage.getItem( 'api_key' ) !== 'undefined' ? localStorage.getItem( 'api_key' ) : '';
    const [api, setApi] = useState( stored_api );

    const gridStyle = {
        marginTop: 20,
    }

    let handleScan = data => {
        if (data) {
            setLoader(true);
            setshowQR(false);
            setApiInput(false);
            scanTicket(data);
        }
    };

    let handleError = data => {
        console.log(data);
    };

    let reScan = () => {
        setshowQR( ! showQR );
        setResult( '' );
        setshowInfo( false );
        setApiInput( true );
    };

    let validApi = () => {
        if ( api ) {
            return api.length > 6;
        }

        return false;
    }

   useEffect( () => {
       if ( ! api ) {
           return;
       }

       if ( validApi() ) {
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
                   setLoader(false);
                   processResult( result );
               },
               (error) => {
                   setLoader(false);
                   setResult( 'Event website is not reachable!' );
               }
           )
   }

   let processResult = ( responseData ) => {
       if ( responseData.msg ) {
           setResult( responseData.msg );
       } else {
           setResult( 'Invalid API Key!' );
       }
       if ( responseData.attendee ) {
           setshowInfo(true);
           setattendeeData( {
               'title' : responseData.attendee.title,
               'email' : responseData.attendee.email,
               'ticket' : responseData.attendee.ticket.title,
               'information': responseData.attendee.information ?? '',
           } )
       }
   }

    return (
        <Container maxWidth='sm'>
            <AppBar position="static" color={"primary"}>
                <Toolbar variant="dense">
                    {/*<IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>*/}
                    {/*    <Menu />*/}
                    {/*</IconButton>*/}
                    <Typography variant="h6" color="inherit" component="div">
                        Event Tickets Scanner {version}
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
                { loader && <CircularProgress /> }

                { apiInput &&
                    <Grid item sm>
                        <TextField
                            id="outlined-basic"
                            label="API Key"
                            variant="outlined"
                            value={api}
                            onChange={(e) => setApi(e.target.value)}
                        />
                    </Grid>
                }
            </Grid>
            <Grid container
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  columnspacing={100}
            >
                { ( ! showQR && showInfo ) &&
                    <Attendee attendeeData={attendeeData} />
                }
            </Grid>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                columnspacing={100}
            >
                {showQR &&
                <h2> Scan Ticket </h2>
                }
                { showQR &&
                <QrReader
                    delay={delay}
                    onError={handleError}
                    onScan={handleScan}
                    style={{width: '100%'}}
                />
                }

                <h3>{result}</h3>

                { ( !showQR && validApi() ) &&
                    <Button color={"primary"} variant="contained" onClick={reScan}> Scan again </Button>
                }
            </Grid>
        </Container>
    );
}
export default Scanner;