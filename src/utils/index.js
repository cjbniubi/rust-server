export function copyText(text) {
  var textarea = document.createElement("textarea"); //创建input对象
  textarea.style.position="fixed"
  textarea.style.zIndex='-999'
  var currentFocus = document.activeElement; //当前获得焦点的元素
  var toolBoxwrap = document.getElementById('app'); //将文本框插入到NewsToolBox这个之后
  toolBoxwrap.appendChild(textarea); //添加元素
  textarea.value = text;
  textarea.focus();
  if (textarea.setSelectionRange) {
      textarea.setSelectionRange(0, textarea.value.length); //获取光标起始位置到结束位置
  } else {
      textarea.select();
  }
  try {
      var flag = document.execCommand("copy"); //执行复制
      ElMessage.success('复制成功')
  } catch (eo) {
      var flag = false;
      ElMessage.error('复制失败')
  }
  toolBoxwrap.removeChild(textarea); //删除元素
  currentFocus.focus();
  return flag; 
}


export function dizhiFormatToobj(str){
  str = decodeURIComponent(str)
  var str1 = str.split("?")[1];
  var str2 = str1.split("&");
  var obj = {}
  console.log(str2)
  for(var i = 0;i<str2.length;i++){
      var a = str2[i].split("=");
      console.log(a)
      obj[a[0]] = a[1]
  }
  return obj
}