import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getRouteApi, postRouteApi } from '../apiService/axios';

interface InputForm {
  setWaypoint: Dispatch<SetStateAction<[]>>;
}

const InputForm = (props: InputForm) =>  {
  const [ token, setToken ] = useState<string>("");
  const [ totalDistance, setTotalDistance ] = useState<number>();
  const [ totalTime, setTotalTime ] = useState<number>();
  const [ errorMsg, setErrorMsg ] = useState<string>("");
  const [ waitingApiRes, setWaitingRes ] = useState<boolean>(false);

  // input data
  const [ startingLocation, setStartingLocation ] = useState<string>("");
  const [ dropOffPoint, setDropOffPoint ] = useState<string>("");

  const clearInputForm = () => {
    setStartingLocation("");
    setDropOffPoint("");
  }

  const resetApiRes = () => {
    setTotalTime(undefined);
    setTotalDistance(undefined);
    setErrorMsg("");
  }

  // call post api at first rendering
  const postRouteResult = () => {
    if ( !startingLocation.trim() || !dropOffPoint.trim() ) return;
    resetApiRes();
    setWaitingRes(true);

    postRouteApi(startingLocation, dropOffPoint)
    .then((response: any) => {
      setToken(response.data.token);
      // TODO: remove this!!!
      getRouteResult();
    })
    .catch((error: any) => {
      setWaitingRes(false);
      // handle error
      if (error.response) {
        setErrorMsg(error.response.data);
      } else {
        console.log('Error', error.message);
      }
    });
  };

  // call get route api
  const getRouteResult = () => {
    if ( !token ) return;
    resetApiRes();
    setWaitingRes(true);

    getRouteApi(token)
    .then((response: any) => {
      setWaitingRes(false);

      if (response.data.status !== "success") {
        if (response.data.status === "in progress") getRouteResult();
        else if (response.data.error) setErrorMsg(response.data.error);
        return;
      }

      // handle success
      props.setWaypoint(response.data.path);
      setTotalDistance(response.data.total_distance);
      setTotalTime(response.data.total_time);
    })
    .catch((error: any) => {
      // handle error
      setWaitingRes(false);

      if (error.response) {
        setErrorMsg(error.response.data);
      } else {
        console.log('Error', error.message);
      }
    });
  }

  // call get api every time token changed
  useEffect(() => {
    getRouteResult();
  }, [token]);

  return (
    <div className="inputForm">
      <div>Starting Location</div>
      <input
        value={startingLocation}
        onChange={(e) => setStartingLocation(e.currentTarget.value)}
      />

      <div>Drop-off point</div>
      <input
        value={dropOffPoint}
        onChange={(e) => setDropOffPoint(e.currentTarget.value)}
      />

      { totalDistance && <div>total distance: {totalDistance}</div> }

      { totalTime && <div>total time: {totalTime}</div> }

      { errorMsg && <div className="errorMsg">{errorMsg}</div> }

      <button
        onClick={postRouteResult} 
        disabled={waitingApiRes}
      >
        { totalDistance ? "Re-Submit" : "Submit" }
      </button>

      <button
        onClick={clearInputForm} 
        disabled={waitingApiRes}
      >
        Reset
      </button>
      
    </div>
  );
}

export default InputForm;