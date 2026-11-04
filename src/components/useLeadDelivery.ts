import { useCallback, useEffect, useRef, useState } from 'react';
import { captureReady } from '../config/site';
import { clearPending, pendingLead, queueLead, submitLead, type Lead } from '../lib/leads';
export default function useLeadDelivery(){
  const [status,setStatus]=useState<'idle'|'sending'|'success'|'error'>('idle');
  const lead=useRef<Lead|null>(null),running=useRef(false),attempts=useRef(0),timer=useRef<ReturnType<typeof setTimeout>|null>(null),active=useRef(true);
  const deliver=useCallback(async function run(){
    if(!active.current||running.current||!lead.current||!captureReady())return;
    running.current=true;setStatus('sending');
    try{await submitLead(lead.current);clearPending();lead.current=null;if(active.current)setStatus('success');}
    catch{attempts.current++;if(active.current){setStatus('error');if(attempts.current<5)timer.current=setTimeout(()=>{void run();},Math.min(60000,4000*2**attempts.current));}}
    finally{running.current=false;}
  },[]);
  useEffect(()=>{active.current=true;lead.current=pendingLead();if(lead.current)void deliver();const online=()=>void deliver();addEventListener('online',online);return()=>{active.current=false;removeEventListener('online',online);if(timer.current)clearTimeout(timer.current);};},[deliver]);
  const enqueue=useCallback((value:Lead)=>{lead.current=value;attempts.current=0;queueLead(value);void deliver();},[deliver]);
  const retry=()=>{attempts.current=0;if(timer.current)clearTimeout(timer.current);void deliver();};
  return {status,enqueue,retry};
}
