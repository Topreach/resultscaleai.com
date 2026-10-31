"use client";
import {useEffect,useRef,useState} from "react";
import Script from "next/script";
import type {MonetizationConfig} from "@/types";
interface AdSlotProps{slot:keyof MonetizationConfig["adsense"]["slots"];format?:"banner"|"rectangle"|"leaderboard";className?:string}
declare global{interface Window{adsbygoogle?:unknown[]}}
function AdUnit({publisher,unit}:{publisher:string;unit:string}){
 const element=useRef<HTMLModElement>(null);
 function initialize(){if(element.current&&!element.current.dataset.adsbygoogleStatus){try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch{ /* Ad blockers and unavailable inventory should not interrupt page content. */ }}}
 return <><Script id="adsense" async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisher}`} crossOrigin="anonymous" onReady={initialize}/><ins ref={element} className="adsbygoogle" style={{display:"block"}} data-ad-client={publisher} data-ad-slot={unit} data-ad-format="auto" data-full-width-responsive="true"/></>;
}
export default function AdSlot({slot,format="banner",className=""}:AdSlotProps){
 const [config,setConfig]=useState<MonetizationConfig|null>(null);
 useEffect(()=>{fetch("/api/admin/monetization").then(async res=>{if(!res.ok)throw new Error();setConfig(await res.json());}).catch(()=>setConfig(null));},[]);
 const ads=config?.adsense,unit=ads?.unitIds?.[slot];
 if(!ads?.enabled||!ads.slots[slot]||!/^ca-pub-\d+$/.test(ads.publisherId)||!unit||!/^\d+$/.test(unit))return null;
 return <aside aria-label="Advertisement" className={`w-full ${className}`}><p className="text-xs text-gray-400 mb-2 text-center">Advertisement</p><div className={format==="rectangle"?"min-h-[250px]":"min-h-[90px]"}><AdUnit key={`${ads.publisherId}:${unit}`} publisher={ads.publisherId} unit={unit}/></div></aside>;
}
