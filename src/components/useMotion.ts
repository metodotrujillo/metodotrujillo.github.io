import { useEffect, type RefObject } from 'react';
export default function useMotion(root: RefObject<HTMLElement | null>) {
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    if(media.matches || !root.current)return;
    let disposed=false;const cleanups:(()=>void)[]=[];
    void Promise.all([import('animejs/animation'),import('animejs/utils')]).then(([{animate},{stagger}])=>{
      if(disposed||!root.current||media.matches)return;
      const entrance=animate(root.current.querySelectorAll('[data-enter]'),{translateY:[16,0],opacity:[.6,1],duration:650,delay:stagger(70),ease:'out(3)'});cleanups.push(()=>entrance.revert());
      const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){const card=entry.target as HTMLElement;const reveal=animate(card,{translateY:[20,0],opacity:[.7,1],duration:650,ease:'out(3)'});cleanups.push(()=>reveal.revert());observer.unobserve(card);}}),{threshold:.15});
      root.current.querySelectorAll<HTMLElement>('.tool-card').forEach(card=>{
        observer.observe(card);
        const enter=()=>{if(!media.matches){const a=animate(card.querySelectorAll('.bento-art'),{translateY:-4,scale:1.025,duration:400,ease:'out(3)'});cleanups.push(()=>a.revert());}};
        const leave=()=>{if(!media.matches){const a=animate(card.querySelectorAll('.bento-art'),{translateY:0,scale:1,duration:400,ease:'out(3)'});cleanups.push(()=>a.revert());}};
        const move=(e:PointerEvent)=>{if(e.pointerType==='touch'||media.matches)return;const r=card.getBoundingClientRect();card.style.setProperty('--spot-x',`${e.clientX-r.left}px`);card.style.setProperty('--spot-y',`${e.clientY-r.top}px`);};
        card.addEventListener('pointerenter',enter);card.addEventListener('pointerleave',leave);card.addEventListener('pointermove',move);cleanups.push(()=>{card.removeEventListener('pointerenter',enter);card.removeEventListener('pointerleave',leave);card.removeEventListener('pointermove',move);});
      });cleanups.push(()=>observer.disconnect());
      const stop=()=>{if(media.matches)cleanups.forEach(f=>f());};media.addEventListener('change',stop);cleanups.push(()=>media.removeEventListener('change',stop));
    });return()=>{disposed=true;cleanups.forEach(f=>f());};
  },[root]);
}
