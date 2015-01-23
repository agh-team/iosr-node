
$(function(){
  $.pjax({
    area: 'body',
    load: { head: 'base, meta, link', css: true, script: true },
    form: 'form.pjax'
  });
});
