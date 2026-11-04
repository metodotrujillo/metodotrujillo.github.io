import { useEffect } from 'react';
import { site } from '../config/site';
export default function Analytics(){
  useEffect(()=>{if(!site.analytics.enabled||!site.analytics.plausibleDomain)return;const script=document.createElement('script');script.defer=true;script.dataset.domain=site.analytics.plausibleDomain;script.src=site.analytics.scriptUrl;document.head.append(script);return()=>script.remove();},[]);return null;
}
