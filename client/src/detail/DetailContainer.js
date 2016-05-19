import { connect } from 'react-redux'
import Detail from './DetailComponent'

const mapStateToProps = (state) => {
  return state.get('details').toJS();
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const DetailContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Detail);

export default DetailContainer