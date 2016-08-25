(function () {
  'use strict';

  window.k.LayerSelector = class LayerSelector extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
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
      let layers = this.state.layers;
      layers.push({ foo: 123 });

      this.props.socket.emit('set-layers', layers);
    }

    render() {
      var items = this.state.layers.map((l, i) =>
          React.createElement('li', null, 'layer ' + i));

      return React.createElement('div', null,
          React.createElement('h3', null, 'Layer Selector'),
          React.createElement('ul', null, items),
          React.createElement('button', { onClick: this.addLayer }, 'Add Layer'));
    }
  };

})();
