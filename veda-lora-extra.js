(()=>{
const KEY='h3MobileLoraLibraryV1';
const extras=[
 {id:'veda-mystic-xxx-mmh3-v5',name:'MysticXXX MMH3 V5',filename:'MysticXXX_MMH3-V5.safetensors',originalFilename:'MysticXXX_MMH3-V5.safetensors',sha256:'',defaultStrength:1},
 {id:'veda-cxy-kiss-v3',name:'CXY Kiss v3',filename:'cxy_kiss_v3_000002200.safetensors',originalFilename:'cxy_kiss_v3_000002200.safetensors',sha256:'',defaultStrength:1},
 {id:'veda-nipplesuck-k3nk',name:'Nipple Suck k3nk',filename:'h3-nipplesuck-step00007000-k3nk.safetensors',originalFilename:'h3-nipplesuck-step00007000-k3nk.safetensors',sha256:'',defaultStrength:1},
 {id:'veda-jav-voice',name:'MiniMax JAV Voice',filename:'minimax-jav-voice.safetensors',originalFilename:'minimax-jav-voice.safetensors',sha256:'',defaultStrength:1},
 {id:'veda-hm-pussy-v2',name:'HM Pussy V2',filename:'HMPussyV2.safetensors',originalFilename:'HMPussyV2.safetensors',sha256:'',defaultStrength:1},
 {id:'veda-rough-sex',name:'Rough Sex',filename:'Rough.Sex.safetensors',originalFilename:'Rough.Sex.safetensors',sha256:'',defaultStrength:1}
];
try{
  const lib=JSON.parse(localStorage.getItem(KEY)||'[]');
  if(Array.isArray(lib)){
    for(const e of extras) if(!lib.some(item=>item&&item.filename===e.filename)) lib.push(e);
    localStorage.setItem(KEY,JSON.stringify(lib));
  }
}catch(e){}
})();
