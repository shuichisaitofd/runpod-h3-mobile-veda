(()=>{
const KEY='h3MobileLoraLibraryV1';
const extras=[
 {id:'veda-mystic-xxx-mmh3-v5',name:'MysticXXX MMH3 V5',filename:'MysticXXX_MMH3-V5.safetensors',originalFilename:'MysticXXX_MMH3-V5.safetensors',sha256:'',defaultStrength:1}
];
try{
  const lib=JSON.parse(localStorage.getItem(KEY)||'[]');
  if(Array.isArray(lib)){
    for(const e of extras) if(!lib.some(item=>item&&item.filename===e.filename)) lib.push(e);
    localStorage.setItem(KEY,JSON.stringify(lib));
  }
}catch(e){}
})();
