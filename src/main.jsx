// main.js
const boards      = require('./boards.json');
const LazyLoad    = require('./LazyLoad');
const React       = require('react');
const ReactDOM    = require('react-dom');
const SearchInput = require('react-search-input');
const Image       = require('./image');

var TitleBar = React.createClass({
  render: function () {
    return (
      <div style={
        { backgroundColor:'rgb(55,55,55)'
        , width:'100%', height:'64px'
        , boxShadow: '0px 0.1em 0.5em #000'
        }
      }>
      <div style={{padding: '10 10 10 10'}}>
        <a href='/'>
          <img src='/images/logo.png' />
        </a>
      </div>
        <SearchInput ref={function (ref) {this.search = ref}.bind(this)} onChange={this.props.searchCallback} />
      </div>
    );
  }
});


const dim = {
  thumb : {
      w    : 300
    , h    : 225
    , capH : 48
    , descrH : 96
  }
}

var BoardThumb = React.createClass({
  getInitialState: function() {
    return {hover: false};
  },
  handleMouseOver: function (e) {
    this.setState({hover: true});
  },
  handleMouseOut: function (e) {
    this.setState({hover: false});
  },
  handleClick: function (e) {
      document.location.href += 'boards/' + this.props.data.id;
  },
  render: function () {
    var style = {
      backgroundColor: '#FAFAFA'
      , width: (dim.thumb.w * 0.8) + 32 + 16
      , height: (dim.thumb.h * 0.8) + dim.thumb.capH +  dim.thumb.descrH + 16 + 5
      , borderRadius: 10
      , color: 'rgb(55,55,55)'
      , marginTop:  8
      , marginRight: 8
      , marginBottom: 8
      , marginLeft: 8
      , display: 'inline-block'
      , border: '1px solid #CFCFCF'
      , cursor: 'pointer'
      , overflow: 'hidden'
    };
    var imgStyle = {
      width: dim.thumb.w * 0.8
      , height: dim.thumb.h * 0.8
      , marginTop: 16
    };
    var titleStyle = {
      height: dim.thumb.capH
      , textAlign: 'center'
      , verticalAlign: 'middle'
      , lineHeight: String(dim.thumb.capH) + 'px'
      , fontWeight: 'bold'
      , fontSize: 18
      , paddingBottom: 5
      , opacity: 1.0
    };
    var descrStyle = {
      visibility: 'visible'
      , height: dim.thumb.descrH
      , overflow: 'hidden'
      , padding: '10 10 10 10'
      , textAlign: 'center'
      , verticalAlign: 'top'
      , backgroundColor: '#F0F0F0'
      , fontSize: 16
      , marginBottom: 10
      , opacity: 1.0
    };

    var image =
        <LazyLoad once={true} component={React.createElement('div', {style:imgStyle})} distance={300}>
          <Image src={'boards/' + this.props.data.id + '/images/thumb.png'}
            style = {imgStyle} />
        </LazyLoad>;

    return (
      <div
        onClick={this.handleClick}
        style={style}
        className={'hover-shadow'}
      >
        <center>
        {image}
        </center>
        <div style={titleStyle}>
          {this.props.data.id.split('/').slice(1).join(' / ')}
        </div>
        <div style={descrStyle}>
          {(function() {
              var str = this.props.data.description;
              if (str.length > 87) {
                str = str.substr(0,87);
                if (str[87] !== ' ') {
                  str = str.concat(' ');
                }
                str = str.concat('...');
              }
              return str;
            }).call(this)
          }
        </div>
      </div>
    );
  }
});

var BoardList = React.createClass({
  render: function () {
    if (this.props.data.length === 0) {
      return (
        <div>
          <div style={{height:'40%'}}></div>
          <div style={{width:'100%', textAlign:'center'}}>
                No results
          </div>
        </div>
      );
    }
    var thumbNodes = this.props.data.map(function(data) {
      return (
        <BoardThumb data={data} />
      );
    });
    return (
      <div style={{margin: 32, textAlign:'center'}}>
      {thumbNodes}
      </div>
    );
  }
});

var Main = React.createClass({
  getInitialState: function() {
    return {result: boards};
  },
  render: function () {
    return (
      <div>
        <TitleBar ref='title' searchCallback={this.searchUpdated} />
        <BoardList data={this.state.result} />
      </div>
    );
  },

  searchUpdated: function (term) {
    if (this.refs.title.search) {
      var filters = ['id', 'description'];
      var result = boards.filter(this.refs.title.search.filter(filters));
      this.setState({result: result});
    }
  }
});

ReactDOM.render(
  <Main />,
  document.getElementById('content')
);
