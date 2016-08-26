(function () {
  'use strict';

  window.k.LayerSelector = class LayerSelector extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        activeIndex: 0,
        layers: [],
      };

      this.addLayer = this.addLayer.bind(this);
    }

    componentDidMount() {
      this.props.socket.on('set-layers', newLayers => {
        this.setState({
          layers: newLayers,
        });
      });
    }

    addLayer() {
      let layers = this.state.layers.slice();
      layers.push({ foo: 123 });

      this.props.socket.emit('set-layers', layers);
    }

    removeLayer(i) {
      let layers = this.state.layers.slice();
      layers.splice(i, 1);
      this.props.socket.emit('set-layers', layers);
    }

    render() {
      var items = this.state.layers.map((l, i) =>
          React.createElement('a', { className: 'list-group-item' + (this.state.activeIndex === i ? ' active' : ''), onClick: () => this.setState({ activeIndex: i }) },
            'layer ' + i,
            React.createElement('button', { className: 'btn btn-link', onClick: () => this.removeLayer(i) },
              React.createElement('i', { className: 'glyphicon glyphicon-trash' }))));

      return React.createElement('div', null,
          React.createElement('h4', null, 'Layers'),
          React.createElement('div', { className: 'list-group' }, items),
          React.createElement('button', { onClick: this.addLayer, className: 'btn' }, 'Add Layer'));
    }
  };

})();
