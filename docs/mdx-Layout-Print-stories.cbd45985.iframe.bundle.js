"use strict";(self.webpackChunkairview_next=self.webpackChunkairview_next||[]).push([[7607],{"./stories/mdx/Layout.Print.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Default:()=>Default,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Layout_Print_stories});var react=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),Box=__webpack_require__("./node_modules/@mui/material/Box/Box.js"),Fab=__webpack_require__("./node_modules/@mui/material/Fab/Fab.js"),useScrollTrigger=__webpack_require__("./node_modules/@mui/material/useScrollTrigger/useScrollTrigger.js"),Fade=__webpack_require__("./node_modules/@mui/material/Fade/Fade.js"),src=__webpack_require__("./node_modules/pagedjs/src/index.js"),KeyboardArrowUp=__webpack_require__("./node_modules/@mui/icons-material/KeyboardArrowUp.js"),Close=__webpack_require__("./node_modules/@mui/icons-material/Close.js"),__jsx=react.createElement;function PagedOutput(_ref){var children=_ref.children,handlePrint=_ref.handlePrint,mdxContainer=(0,react.useRef)(null),previewContainer=(0,react.useRef)(null),_useState=(0,react.useState)(!1),setRendered=(_useState[0],_useState[1]);return(0,react.useEffect)((function(){var timerId=setTimeout((function(){var paged=new src.Mi,contentMdx="".concat(mdxContainer.current.innerHTML);previewContainer.current.innerHTML="",paged.preview(contentMdx,["/pdf.css"],previewContainer.current).then((function(flow){setRendered(!0)}))}),5e3);return function(){return clearTimeout(timerId)}}),[children]),__jsx(react.Fragment,null,__jsx(Box.Z,{onClick:function onClick(){return handlePrint()},role:"presentation",sx:{position:"fixed",top:16,right:16,displayPrint:"none"}},__jsx(Fab.Z,{size:"small","aria-label":"scroll back to top"},__jsx(Close.Z,null))),__jsx("div",{id:"back-to-top-anchor",sx:{displayPrint:"none",height:0}}),__jsx("div",{className:"pagedjs_page",ref:previewContainer}," "),__jsx("div",{ref:mdxContainer,style:{display:"none"}},children&&children),__jsx(ScrollTop,null,__jsx(Fab.Z,{size:"small","aria-label":"scroll back to top",sx:{displayPrint:"none"}},__jsx(KeyboardArrowUp.Z,null))))}function ScrollTop(_ref2){var children=_ref2.children,trigger=(0,useScrollTrigger.Z)({disableHysteresis:!0,threshold:100});return __jsx(Fade.Z,{in:trigger},__jsx(Box.Z,{onClick:function handleClick(event){var anchor=(event.target.ownerDocument||document).querySelector("#back-to-top-anchor");anchor&&anchor.scrollIntoView({block:"center"})},role:"presentation",sx:{position:"fixed",bottom:16,right:16}},children))}ScrollTop.displayName="ScrollTop",PagedOutput.__docgenInfo={description:"",methods:[],displayName:"PagedOutput"};__webpack_require__("./node_modules/@storybook/react/dist/index.mjs");var mdxify=__webpack_require__("./stories/mdx/utils/mdxify.js"),Layout_Print_stories_jsx=react.createElement;const Layout_Print_stories={title:"Content/Print",component:PagedOutput,tags:["autodocs"],argTypes:{zoom:{control:"select",options:["ppt","a4","storybook"]}},args:{context:null},decorators:[function(Story,context){return Layout_Print_stories_jsx(mdxify.am,null,Layout_Print_stories_jsx(Story,null))}]};var Template=function Template(args,context){return Layout_Print_stories_jsx(PagedOutput,{handlePrint:function dummyFunction(){}},Layout_Print_stories_jsx(mdxify.Xi,null,args.children))};Template.displayName="Template";var Default=Template.bind({});Default.args={children:"# Title\n      ## subtitle\n      \n      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi eu ipsum enim.\n      \n      ![](http:///localhost:6006/hero/lizards.png)\n\n      ",zoom:"ppt"},Default.parameters={...Default.parameters,docs:{...Default.parameters?.docs,source:{originalSource:"(args, context) => {\n  function dummyFunction() {}\n  return <PagedOutput handlePrint={dummyFunction}>\n      <WrapMDX>\n      {args.children}\n      </WrapMDX>\n      </PagedOutput>;\n}",...Default.parameters?.docs?.source}}};const __namedExportsOrder=["Default"]}}]);