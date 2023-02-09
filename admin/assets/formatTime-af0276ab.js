function M(a){if(a===null||a===!0||a===!1)return NaN;var t=Number(a);return isNaN(t)?t:t<0?Math.ceil(t):Math.floor(t)}function h(a,t){if(t.length<a)throw new TypeError(a+" argument"+(a>1?"s":"")+" required, but only "+t.length+" present")}function Y(a){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?Y=function(e){return typeof e}:Y=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Y(a)}function y(a){h(1,arguments);var t=Object.prototype.toString.call(a);return a instanceof Date||Y(a)==="object"&&t==="[object Date]"?new Date(a.getTime()):typeof a=="number"||t==="[object Number]"?new Date(a):((typeof a=="string"||t==="[object String]")&&typeof console<"u"&&(console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"),console.warn(new Error().stack)),new Date(NaN))}function re(a,t){h(2,arguments);var e=y(a).getTime(),r=M(t);return new Date(e+r)}var ne={};function F(){return ne}function ie(a){var t=new Date(Date.UTC(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds(),a.getMilliseconds()));return t.setUTCFullYear(a.getFullYear()),a.getTime()-t.getTime()}function E(a){return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?E=function(e){return typeof e}:E=function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},E(a)}function oe(a){return h(1,arguments),a instanceof Date||E(a)==="object"&&Object.prototype.toString.call(a)==="[object Date]"}function ue(a){if(h(1,arguments),!oe(a)&&typeof a!="number")return!1;var t=y(a);return!isNaN(Number(t))}function se(a,t){h(2,arguments);var e=M(t);return re(a,-e)}var de=864e5;function le(a){h(1,arguments);var t=y(a),e=t.getTime();t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0);var r=t.getTime(),n=e-r;return Math.floor(n/de)+1}function N(a){h(1,arguments);var t=1,e=y(a),r=e.getUTCDay(),n=(r<t?7:0)+r-t;return e.setUTCDate(e.getUTCDate()-n),e.setUTCHours(0,0,0,0),e}function V(a){h(1,arguments);var t=y(a),e=t.getUTCFullYear(),r=new Date(0);r.setUTCFullYear(e+1,0,4),r.setUTCHours(0,0,0,0);var n=N(r),i=new Date(0);i.setUTCFullYear(e,0,4),i.setUTCHours(0,0,0,0);var o=N(i);return t.getTime()>=n.getTime()?e+1:t.getTime()>=o.getTime()?e:e-1}function ce(a){h(1,arguments);var t=V(a),e=new Date(0);e.setUTCFullYear(t,0,4),e.setUTCHours(0,0,0,0);var r=N(e);return r}var fe=6048e5;function me(a){h(1,arguments);var t=y(a),e=N(t).getTime()-ce(t).getTime();return Math.round(e/fe)+1}function $(a,t){var e,r,n,i,o,s,l,d;h(1,arguments);var f=F(),c=M((e=(r=(n=(i=t==null?void 0:t.weekStartsOn)!==null&&i!==void 0?i:t==null||(o=t.locale)===null||o===void 0||(s=o.options)===null||s===void 0?void 0:s.weekStartsOn)!==null&&n!==void 0?n:f.weekStartsOn)!==null&&r!==void 0?r:(l=f.locale)===null||l===void 0||(d=l.options)===null||d===void 0?void 0:d.weekStartsOn)!==null&&e!==void 0?e:0);if(!(c>=0&&c<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");var v=y(a),m=v.getUTCDay(),w=(m<c?7:0)+m-c;return v.setUTCDate(v.getUTCDate()-w),v.setUTCHours(0,0,0,0),v}function J(a,t){var e,r,n,i,o,s,l,d;h(1,arguments);var f=y(a),c=f.getUTCFullYear(),v=F(),m=M((e=(r=(n=(i=t==null?void 0:t.firstWeekContainsDate)!==null&&i!==void 0?i:t==null||(o=t.locale)===null||o===void 0||(s=o.options)===null||s===void 0?void 0:s.firstWeekContainsDate)!==null&&n!==void 0?n:v.firstWeekContainsDate)!==null&&r!==void 0?r:(l=v.locale)===null||l===void 0||(d=l.options)===null||d===void 0?void 0:d.firstWeekContainsDate)!==null&&e!==void 0?e:1);if(!(m>=1&&m<=7))throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");var w=new Date(0);w.setUTCFullYear(c+1,0,m),w.setUTCHours(0,0,0,0);var O=$(w,t),T=new Date(0);T.setUTCFullYear(c,0,m),T.setUTCHours(0,0,0,0);var P=$(T,t);return f.getTime()>=O.getTime()?c+1:f.getTime()>=P.getTime()?c:c-1}function he(a,t){var e,r,n,i,o,s,l,d;h(1,arguments);var f=F(),c=M((e=(r=(n=(i=t==null?void 0:t.firstWeekContainsDate)!==null&&i!==void 0?i:t==null||(o=t.locale)===null||o===void 0||(s=o.options)===null||s===void 0?void 0:s.firstWeekContainsDate)!==null&&n!==void 0?n:f.firstWeekContainsDate)!==null&&r!==void 0?r:(l=f.locale)===null||l===void 0||(d=l.options)===null||d===void 0?void 0:d.firstWeekContainsDate)!==null&&e!==void 0?e:1),v=J(a,t),m=new Date(0);m.setUTCFullYear(v,0,c),m.setUTCHours(0,0,0,0);var w=$(m,t);return w}var ve=6048e5;function ge(a,t){h(1,arguments);var e=y(a),r=$(e,t).getTime()-he(e,t).getTime();return Math.round(r/ve)+1}function u(a,t){for(var e=a<0?"-":"",r=Math.abs(a).toString();r.length<t;)r="0"+r;return e+r}var we={y:function(t,e){var r=t.getUTCFullYear(),n=r>0?r:1-r;return u(e==="yy"?n%100:n,e.length)},M:function(t,e){var r=t.getUTCMonth();return e==="M"?String(r+1):u(r+1,2)},d:function(t,e){return u(t.getUTCDate(),e.length)},a:function(t,e){var r=t.getUTCHours()/12>=1?"pm":"am";switch(e){case"a":case"aa":return r.toUpperCase();case"aaa":return r;case"aaaaa":return r[0];case"aaaa":default:return r==="am"?"a.m.":"p.m."}},h:function(t,e){return u(t.getUTCHours()%12||12,e.length)},H:function(t,e){return u(t.getUTCHours(),e.length)},m:function(t,e){return u(t.getUTCMinutes(),e.length)},s:function(t,e){return u(t.getUTCSeconds(),e.length)},S:function(t,e){var r=e.length,n=t.getUTCMilliseconds(),i=Math.floor(n*Math.pow(10,r-3));return u(i,e.length)}};const p=we;var D={am:"am",pm:"pm",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},ye={G:function(t,e,r){var n=t.getUTCFullYear()>0?1:0;switch(e){case"G":case"GG":case"GGG":return r.era(n,{width:"abbreviated"});case"GGGGG":return r.era(n,{width:"narrow"});case"GGGG":default:return r.era(n,{width:"wide"})}},y:function(t,e,r){if(e==="yo"){var n=t.getUTCFullYear(),i=n>0?n:1-n;return r.ordinalNumber(i,{unit:"year"})}return p.y(t,e)},Y:function(t,e,r,n){var i=J(t,n),o=i>0?i:1-i;if(e==="YY"){var s=o%100;return u(s,2)}return e==="Yo"?r.ordinalNumber(o,{unit:"year"}):u(o,e.length)},R:function(t,e){var r=V(t);return u(r,e.length)},u:function(t,e){var r=t.getUTCFullYear();return u(r,e.length)},Q:function(t,e,r){var n=Math.ceil((t.getUTCMonth()+1)/3);switch(e){case"Q":return String(n);case"QQ":return u(n,2);case"Qo":return r.ordinalNumber(n,{unit:"quarter"});case"QQQ":return r.quarter(n,{width:"abbreviated",context:"formatting"});case"QQQQQ":return r.quarter(n,{width:"narrow",context:"formatting"});case"QQQQ":default:return r.quarter(n,{width:"wide",context:"formatting"})}},q:function(t,e,r){var n=Math.ceil((t.getUTCMonth()+1)/3);switch(e){case"q":return String(n);case"qq":return u(n,2);case"qo":return r.ordinalNumber(n,{unit:"quarter"});case"qqq":return r.quarter(n,{width:"abbreviated",context:"standalone"});case"qqqqq":return r.quarter(n,{width:"narrow",context:"standalone"});case"qqqq":default:return r.quarter(n,{width:"wide",context:"standalone"})}},M:function(t,e,r){var n=t.getUTCMonth();switch(e){case"M":case"MM":return p.M(t,e);case"Mo":return r.ordinalNumber(n+1,{unit:"month"});case"MMM":return r.month(n,{width:"abbreviated",context:"formatting"});case"MMMMM":return r.month(n,{width:"narrow",context:"formatting"});case"MMMM":default:return r.month(n,{width:"wide",context:"formatting"})}},L:function(t,e,r){var n=t.getUTCMonth();switch(e){case"L":return String(n+1);case"LL":return u(n+1,2);case"Lo":return r.ordinalNumber(n+1,{unit:"month"});case"LLL":return r.month(n,{width:"abbreviated",context:"standalone"});case"LLLLL":return r.month(n,{width:"narrow",context:"standalone"});case"LLLL":default:return r.month(n,{width:"wide",context:"standalone"})}},w:function(t,e,r,n){var i=ge(t,n);return e==="wo"?r.ordinalNumber(i,{unit:"week"}):u(i,e.length)},I:function(t,e,r){var n=me(t);return e==="Io"?r.ordinalNumber(n,{unit:"week"}):u(n,e.length)},d:function(t,e,r){return e==="do"?r.ordinalNumber(t.getUTCDate(),{unit:"date"}):p.d(t,e)},D:function(t,e,r){var n=le(t);return e==="Do"?r.ordinalNumber(n,{unit:"dayOfYear"}):u(n,e.length)},E:function(t,e,r){var n=t.getUTCDay();switch(e){case"E":case"EE":case"EEE":return r.day(n,{width:"abbreviated",context:"formatting"});case"EEEEE":return r.day(n,{width:"narrow",context:"formatting"});case"EEEEEE":return r.day(n,{width:"short",context:"formatting"});case"EEEE":default:return r.day(n,{width:"wide",context:"formatting"})}},e:function(t,e,r,n){var i=t.getUTCDay(),o=(i-n.weekStartsOn+8)%7||7;switch(e){case"e":return String(o);case"ee":return u(o,2);case"eo":return r.ordinalNumber(o,{unit:"day"});case"eee":return r.day(i,{width:"abbreviated",context:"formatting"});case"eeeee":return r.day(i,{width:"narrow",context:"formatting"});case"eeeeee":return r.day(i,{width:"short",context:"formatting"});case"eeee":default:return r.day(i,{width:"wide",context:"formatting"})}},c:function(t,e,r,n){var i=t.getUTCDay(),o=(i-n.weekStartsOn+8)%7||7;switch(e){case"c":return String(o);case"cc":return u(o,e.length);case"co":return r.ordinalNumber(o,{unit:"day"});case"ccc":return r.day(i,{width:"abbreviated",context:"standalone"});case"ccccc":return r.day(i,{width:"narrow",context:"standalone"});case"cccccc":return r.day(i,{width:"short",context:"standalone"});case"cccc":default:return r.day(i,{width:"wide",context:"standalone"})}},i:function(t,e,r){var n=t.getUTCDay(),i=n===0?7:n;switch(e){case"i":return String(i);case"ii":return u(i,e.length);case"io":return r.ordinalNumber(i,{unit:"day"});case"iii":return r.day(n,{width:"abbreviated",context:"formatting"});case"iiiii":return r.day(n,{width:"narrow",context:"formatting"});case"iiiiii":return r.day(n,{width:"short",context:"formatting"});case"iiii":default:return r.day(n,{width:"wide",context:"formatting"})}},a:function(t,e,r){var n=t.getUTCHours(),i=n/12>=1?"pm":"am";switch(e){case"a":case"aa":return r.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"aaa":return r.dayPeriod(i,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return r.dayPeriod(i,{width:"narrow",context:"formatting"});case"aaaa":default:return r.dayPeriod(i,{width:"wide",context:"formatting"})}},b:function(t,e,r){var n=t.getUTCHours(),i;switch(n===12?i=D.noon:n===0?i=D.midnight:i=n/12>=1?"pm":"am",e){case"b":case"bb":return r.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"bbb":return r.dayPeriod(i,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return r.dayPeriod(i,{width:"narrow",context:"formatting"});case"bbbb":default:return r.dayPeriod(i,{width:"wide",context:"formatting"})}},B:function(t,e,r){var n=t.getUTCHours(),i;switch(n>=17?i=D.evening:n>=12?i=D.afternoon:n>=4?i=D.morning:i=D.night,e){case"B":case"BB":case"BBB":return r.dayPeriod(i,{width:"abbreviated",context:"formatting"});case"BBBBB":return r.dayPeriod(i,{width:"narrow",context:"formatting"});case"BBBB":default:return r.dayPeriod(i,{width:"wide",context:"formatting"})}},h:function(t,e,r){if(e==="ho"){var n=t.getUTCHours()%12;return n===0&&(n=12),r.ordinalNumber(n,{unit:"hour"})}return p.h(t,e)},H:function(t,e,r){return e==="Ho"?r.ordinalNumber(t.getUTCHours(),{unit:"hour"}):p.H(t,e)},K:function(t,e,r){var n=t.getUTCHours()%12;return e==="Ko"?r.ordinalNumber(n,{unit:"hour"}):u(n,e.length)},k:function(t,e,r){var n=t.getUTCHours();return n===0&&(n=24),e==="ko"?r.ordinalNumber(n,{unit:"hour"}):u(n,e.length)},m:function(t,e,r){return e==="mo"?r.ordinalNumber(t.getUTCMinutes(),{unit:"minute"}):p.m(t,e)},s:function(t,e,r){return e==="so"?r.ordinalNumber(t.getUTCSeconds(),{unit:"second"}):p.s(t,e)},S:function(t,e){return p.S(t,e)},X:function(t,e,r,n){var i=n._originalDate||t,o=i.getTimezoneOffset();if(o===0)return"Z";switch(e){case"X":return A(o);case"XXXX":case"XX":return C(o);case"XXXXX":case"XXX":default:return C(o,":")}},x:function(t,e,r,n){var i=n._originalDate||t,o=i.getTimezoneOffset();switch(e){case"x":return A(o);case"xxxx":case"xx":return C(o);case"xxxxx":case"xxx":default:return C(o,":")}},O:function(t,e,r,n){var i=n._originalDate||t,o=i.getTimezoneOffset();switch(e){case"O":case"OO":case"OOO":return"GMT"+I(o,":");case"OOOO":default:return"GMT"+C(o,":")}},z:function(t,e,r,n){var i=n._originalDate||t,o=i.getTimezoneOffset();switch(e){case"z":case"zz":case"zzz":return"GMT"+I(o,":");case"zzzz":default:return"GMT"+C(o,":")}},t:function(t,e,r,n){var i=n._originalDate||t,o=Math.floor(i.getTime()/1e3);return u(o,e.length)},T:function(t,e,r,n){var i=n._originalDate||t,o=i.getTime();return u(o,e.length)}};function I(a,t){var e=a>0?"-":"+",r=Math.abs(a),n=Math.floor(r/60),i=r%60;if(i===0)return e+String(n);var o=t||"";return e+String(n)+o+u(i,2)}function A(a,t){if(a%60===0){var e=a>0?"-":"+";return e+u(Math.abs(a)/60,2)}return C(a,t)}function C(a,t){var e=t||"",r=a>0?"-":"+",n=Math.abs(a),i=u(Math.floor(n/60),2),o=u(n%60,2);return r+i+e+o}const be=ye;var B=function(t,e){switch(t){case"P":return e.date({width:"short"});case"PP":return e.date({width:"medium"});case"PPP":return e.date({width:"long"});case"PPPP":default:return e.date({width:"full"})}},z=function(t,e){switch(t){case"p":return e.time({width:"short"});case"pp":return e.time({width:"medium"});case"ppp":return e.time({width:"long"});case"pppp":default:return e.time({width:"full"})}},pe=function(t,e){var r=t.match(/(P+)(p+)?/)||[],n=r[1],i=r[2];if(!i)return B(t,e);var o;switch(n){case"P":o=e.dateTime({width:"short"});break;case"PP":o=e.dateTime({width:"medium"});break;case"PPP":o=e.dateTime({width:"long"});break;case"PPPP":default:o=e.dateTime({width:"full"});break}return o.replace("{{date}}",B(n,e)).replace("{{time}}",z(i,e))},Te={p:z,P:pe};const Ce=Te;var Me=["D","DD"],De=["YY","YYYY"];function Oe(a){return Me.indexOf(a)!==-1}function Pe(a){return De.indexOf(a)!==-1}function j(a,t,e){if(a==="YYYY")throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(t,"`) for formatting years to the input `").concat(e,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));if(a==="YY")throw new RangeError("Use `yy` instead of `YY` (in `".concat(t,"`) for formatting years to the input `").concat(e,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));if(a==="D")throw new RangeError("Use `d` instead of `D` (in `".concat(t,"`) for formatting days of the month to the input `").concat(e,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));if(a==="DD")throw new RangeError("Use `dd` instead of `DD` (in `".concat(t,"`) for formatting days of the month to the input `").concat(e,"`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"))}var Se={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},ke=function(t,e,r){var n,i=Se[t];return typeof i=="string"?n=i:e===1?n=i.one:n=i.other.replace("{{count}}",e.toString()),r!=null&&r.addSuffix?r.comparison&&r.comparison>0?"in "+n:n+" ago":n};const We=ke;function G(a){return function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},e=t.width?String(t.width):a.defaultWidth,r=a.formats[e]||a.formats[a.defaultWidth];return r}}var xe={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},Ue={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},_e={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},Ye={date:G({formats:xe,defaultWidth:"full"}),time:G({formats:Ue,defaultWidth:"full"}),dateTime:G({formats:_e,defaultWidth:"full"})};const Ee=Ye;var Ne={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},$e=function(t,e,r,n){return Ne[t]};const Fe=$e;function W(a){return function(t,e){var r=e!=null&&e.context?String(e.context):"standalone",n;if(r==="formatting"&&a.formattingValues){var i=a.defaultFormattingWidth||a.defaultWidth,o=e!=null&&e.width?String(e.width):i;n=a.formattingValues[o]||a.formattingValues[i]}else{var s=a.defaultWidth,l=e!=null&&e.width?String(e.width):a.defaultWidth;n=a.values[l]||a.values[s]}var d=a.argumentCallback?a.argumentCallback(t):t;return n[d]}}var qe={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},Le={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},He={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},Re={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},Qe={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},Xe={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},Ge=function(t,e){var r=Number(t),n=r%100;if(n>20||n<10)switch(n%10){case 1:return r+"st";case 2:return r+"nd";case 3:return r+"rd"}return r+"th"},Ie={ordinalNumber:Ge,era:W({values:qe,defaultWidth:"wide"}),quarter:W({values:Le,defaultWidth:"wide",argumentCallback:function(t){return t-1}}),month:W({values:He,defaultWidth:"wide"}),day:W({values:Re,defaultWidth:"wide"}),dayPeriod:W({values:Qe,defaultWidth:"wide",formattingValues:Xe,defaultFormattingWidth:"wide"})};const Ae=Ie;function x(a){return function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=e.width,n=r&&a.matchPatterns[r]||a.matchPatterns[a.defaultMatchWidth],i=t.match(n);if(!i)return null;var o=i[0],s=r&&a.parsePatterns[r]||a.parsePatterns[a.defaultParseWidth],l=Array.isArray(s)?je(s,function(c){return c.test(o)}):Be(s,function(c){return c.test(o)}),d;d=a.valueCallback?a.valueCallback(l):l,d=e.valueCallback?e.valueCallback(d):d;var f=t.slice(o.length);return{value:d,rest:f}}}function Be(a,t){for(var e in a)if(a.hasOwnProperty(e)&&t(a[e]))return e}function je(a,t){for(var e=0;e<a.length;e++)if(t(a[e]))return e}function Ve(a){return function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=t.match(a.matchPattern);if(!r)return null;var n=r[0],i=t.match(a.parsePattern);if(!i)return null;var o=a.valueCallback?a.valueCallback(i[0]):i[0];o=e.valueCallback?e.valueCallback(o):o;var s=t.slice(n.length);return{value:o,rest:s}}}var Je=/^(\d+)(th|st|nd|rd)?/i,ze=/\d+/i,Ke={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},Ze={any:[/^b/i,/^(a|c)/i]},et={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},tt={any:[/1/i,/2/i,/3/i,/4/i]},at={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},rt={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},nt={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},it={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},ot={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},ut={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},st={ordinalNumber:Ve({matchPattern:Je,parsePattern:ze,valueCallback:function(t){return parseInt(t,10)}}),era:x({matchPatterns:Ke,defaultMatchWidth:"wide",parsePatterns:Ze,defaultParseWidth:"any"}),quarter:x({matchPatterns:et,defaultMatchWidth:"wide",parsePatterns:tt,defaultParseWidth:"any",valueCallback:function(t){return t+1}}),month:x({matchPatterns:at,defaultMatchWidth:"wide",parsePatterns:rt,defaultParseWidth:"any"}),day:x({matchPatterns:nt,defaultMatchWidth:"wide",parsePatterns:it,defaultParseWidth:"any"}),dayPeriod:x({matchPatterns:ot,defaultMatchWidth:"any",parsePatterns:ut,defaultParseWidth:"any"})};const dt=st;var lt={code:"en-US",formatDistance:We,formatLong:Ee,formatRelative:Fe,localize:Ae,match:dt,options:{weekStartsOn:0,firstWeekContainsDate:1}};const ct=lt;var ft=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,mt=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,ht=/^'([^]*?)'?$/,vt=/''/g,gt=/[a-zA-Z]/;function q(a,t,e){var r,n,i,o,s,l,d,f,c,v,m,w,O,T,P,L,H,R;h(2,arguments);var K=String(t),S=F(),k=(r=(n=e==null?void 0:e.locale)!==null&&n!==void 0?n:S.locale)!==null&&r!==void 0?r:ct,Q=M((i=(o=(s=(l=e==null?void 0:e.firstWeekContainsDate)!==null&&l!==void 0?l:e==null||(d=e.locale)===null||d===void 0||(f=d.options)===null||f===void 0?void 0:f.firstWeekContainsDate)!==null&&s!==void 0?s:S.firstWeekContainsDate)!==null&&o!==void 0?o:(c=S.locale)===null||c===void 0||(v=c.options)===null||v===void 0?void 0:v.firstWeekContainsDate)!==null&&i!==void 0?i:1);if(!(Q>=1&&Q<=7))throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");var X=M((m=(w=(O=(T=e==null?void 0:e.weekStartsOn)!==null&&T!==void 0?T:e==null||(P=e.locale)===null||P===void 0||(L=P.options)===null||L===void 0?void 0:L.weekStartsOn)!==null&&O!==void 0?O:S.weekStartsOn)!==null&&w!==void 0?w:(H=S.locale)===null||H===void 0||(R=H.options)===null||R===void 0?void 0:R.weekStartsOn)!==null&&m!==void 0?m:0);if(!(X>=0&&X<=6))throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");if(!k.localize)throw new RangeError("locale must contain localize property");if(!k.formatLong)throw new RangeError("locale must contain formatLong property");var U=y(a);if(!ue(U))throw new RangeError("Invalid time value");var Z=ie(U),ee=se(U,Z),te={firstWeekContainsDate:Q,weekStartsOn:X,locale:k,_originalDate:U},ae=K.match(mt).map(function(g){var b=g[0];if(b==="p"||b==="P"){var _=Ce[b];return _(g,k.formatLong)}return g}).join("").match(ft).map(function(g){if(g==="''")return"'";var b=g[0];if(b==="'")return wt(g);var _=be[b];if(_)return!(e!=null&&e.useAdditionalWeekYearTokens)&&Pe(g)&&j(g,t,String(a)),!(e!=null&&e.useAdditionalDayOfYearTokens)&&Oe(g)&&j(g,t,String(a)),_(ee,g,k.localize,te);if(b.match(gt))throw new RangeError("Format string contains an unescaped latin alphabet character `"+b+"`");return g}).join("");return ae}function wt(a){var t=a.match(ht);return t?t[1].replace(vt,"'"):a}function yt(a){return q(new Date(a),"dd/MM/yyyy")}function bt(a){return q(new Date(a),"dd MMMM yyyy")}function pt(a){return a?q(new Date(a),"dd MMM yyyy HH:mm:ss"):"NA"}function Tt(a){const t=new Date(new Date(a).toUTCString().substring(0,25));return q(t,"yyyy-MM-dd HH:mm:ss")}export{N as a,ge as b,M as c,me as d,F as e,pt as f,J as g,ct as h,Pe as i,j,Oe as k,Ce as l,se as m,ie as n,Tt as o,yt as p,bt as q,h as r,$ as s,y as t,ue as u,q as v};