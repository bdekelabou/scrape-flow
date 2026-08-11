const https = require('https');
const names = ['accordion','alert','alert-dialog','aspect-ratio','attachment','avatar','badge','breadcrumb','bubble','button','button-group','calendar','card','carousel','chart','checkbox','collapsible','combobox','command','context-menu','dialog','direction','drawer','dropdown-menu','empty','field','form','hover-card','input','input-group','input-otp','item','kbd','label','marker','menubar','message','message-scroller','native-select','navigation-menu','pagination','popover','progress','questionnaire','radio-group','resizable','scroll-area','select','separator','sheet','sidebar','skeleton','slider','sonner','spinner','switch','table','tabs','textarea','toast','toggle','toggle-group','tooltip'];
let done = 0;
for (const name of names) {
  const url = `https://ui.shadcn.com/r/styles/default/${name}.json`;
  https.get(url, res => {
    console.log(`${name} ${res.statusCode}`);
    res.on('data', () => {});
    res.on('end', () => { if (++done === names.length) process.exit(0); });
  }).on('error', e => {
    console.log(`${name} ERR ${e.message}`);
    if (++done === names.length) process.exit(0);
  });
}
