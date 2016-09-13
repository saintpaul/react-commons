babel ./react-reflux-component/src -d ./lib/react-reflux-component
babel ./react-spinner/src -d ./lib/react-spinner
babel ./react-alert-box/src -d ./lib/react-alert-box
babel ./react-call-ajax/src -d ./lib/react-call-ajax
mkdir -p ./lib/react-spinner/scss
mkdir -p ./lib/react-alert-box/scss
cp -R ./react-spinner/src/css/ ./lib/react-spinner/scss
cp -R ./react-alert-box/src/css/ ./lib/react-alert-box/scss