import { connect } from 'react-redux'
import Filter from './Filter'
import { clearCollections, triggerSearch } from '../actions/SearchRequestActions'
import { toggleFacet, toggleExcludeGlobal } from '../actions/SearchParamActions'
import { showCollections } from '../actions/FlowActions'

const mapStateToProps = (state) => {
    return {
        facetMap: state.domain.results.facets,
        selectedFacets: state.behavior.search.selectedFacets
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleFacet: (category, facetName, selected) =>
    dispatch(toggleFacet(category, facetName, selected)),
        submit: () => {
        dispatch(clearCollections())
        dispatch(triggerSearch())
        dispatch(showCollections())
    },
    toggleExcludeGlobal: () => {
        dispatch(toggleExcludeGlobal())
    }
}
}

const FacetContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Filter)

export default FacetContainer
