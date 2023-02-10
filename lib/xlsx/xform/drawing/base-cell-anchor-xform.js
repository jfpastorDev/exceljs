const BaseXform = require('../base-xform');
const CellTypes = require('./cell-types');

class BaseCellAnchorXform extends BaseXform {
  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }
    switch (node.name) {
      case this.tag:
        this.reset();
        this.model = {
          range: {
            editAs: node.attributes.editAs || 'oneCell',
          },
        };

        if (this.tag === 'xdr:twoCellAnchor') {
          this.model.cellType = CellTypes.TWO_CELL;
        } else if (this.tag === 'xdr:oneCellAnchor') {
          this.model.cellType = CellTypes.ONE_CELL;
        }
        break;
      default:
        this.parser = this.map[node.name];
        if (this.parser) {
          this.parser.parseOpen(node);
        }
        break;
    }
    return true;
  }

  parseText(text) {
    if (this.parser) {
      this.parser.parseText(text);
    }
  }

  reconcilePicture(model, options) {
    if (model && model.rId) {
      const rel = options.rels[model.rId];
      const match = rel.Target.match(/.*\/media\/(.+[.][a-zA-Z]{3,4})/);
      if (match) {
        const name = match[1];
        const mediaId = options.mediaIndex[name];
        return options.media[mediaId];
      }
    }
    return undefined;
  }

  reconcileGraphic(model, options) {
    if (
      model &&
      model.graphic &&
      model.graphic.graphicData &&
      model.graphic.graphicData.chart &&
      model.graphic.graphicData.chart.rId
    ) {
      const rel = options.rels[model.graphic.graphicData.chart.rId];
      const match = rel.Target.match(/.*\/charts\/(.+[.][a-zA-Z]{3,4})/);
      if (match) {
        const fullName = match[1];
        const name = fullName.split('.')[0];
        return {chartName: name};
      }
    }
    return undefined;
  }
}

module.exports = BaseCellAnchorXform;
