'use strict'

// Deps
import 'app/adaptors/server/svg4everybody';
import React from 'react';
import Meta from "react-helmet"; //React component will manage all of your changes to the document head
import TransitionManager from 'react-transition-manager'; //smooth page changes which can be tied to the browser history
import classnames from 'classnames'; //A simple javascript utility for conditionally joining classNames together.
import get from 'lodash/object/get'; //Lodash is a toolkit of Javascript functions that provides clean, performant methods for manipulating objects and collections. It is a "fork" of the Underscore library and provides additional functionality as well as some serious performance improvements. If you aren't using Lodash, you should be.
import find from 'lodash/collection/find';//Lodash
import includes from 'lodash/collection/includes';//Lodash

// TODO: see if there's a better way to get fonts in
import 'app/adaptors/server/localfont';
//addapters are all empty?
import window from 'app/adaptors/server/window';
import 'app/lib/animate'; /*a tiny library that helps you write smooth CSS-powered animations in JavaScript.
See a quick demo of 500 elements animating at playground.deaxon.com/js/animate.*/

import Store from 'app/flux/store';/*Flux:APPLICATION ARCHITECTURE FOR BUILDING USER INTERFACES*/
import Nulls from 'app/flux/nulls';

//Reusable page stuff
//devs need popups
import PageContainer from 'app/components/page-container';
import Navigation from 'app/components/navigation';
import Footer from 'app/components/footer';
import Modal from 'app/components/modal';
import EntranceTransition from 'app/components/entrance-transition';
import ContactTray from 'app/components/contact-tray';
import TakeOver from 'app/components/take-over';
import FourOhFour from 'app/components/404';
import BlogCategories from 'app/components/blog-categories';
import NavigationOverlay from 'app/components/navigation-overlay';
import PageLoader from 'app/components/page-loader';

//Individual Pages
const pageMap = {
  'home': require('app/components/home'),
  'what-we-do': require('app/components/what-we-do'),
  'what-we-do/case-study': require('app/components/case-study'),
  'blog': require('app/components/blog'),
  'blog/post': require('app/components/post'),
  'blog/search-results': require('app/components/search-results'),
  'legal': require('app/components/legal'),
  'join-us': require('app/components/join-us'),
  'events': require('app/components/events'),
  'events/event': require('app/components/event')
};

const spinnerBlacklist = ['legal', 'blog/search-results'];

const App = React.createClass({

  getInitialState() {/*Invoked once before the component is mounted. The return value will be used as the initial value of this.state. You should initialize state in the constructor when using ES6 classes,
    and define the getInitialState method when using React.createClass*/
    return this.props.state;
  },
  componentDidMount() {
    /*Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
    At this point in the lifecycle, you can access any refs to your children (e.g., to access the underlying DOM
    representation). The componentDidMount() method of child components is invoked before that of parent components.
    If you want to integrate with other JavaScript frameworks, set timers using setTimeout or setInterval, or
    send AJAX requests, perform those operations in this method.*/
    Store.on('change', this.onChangeStore);
    /*Store is attached to app/flux/store*/
    /*this.onChangeStore executes: this.setState(state); where state is a param of the function*/
  },
  componentWillUnmount() {
    /*Invoked immediately before a component is unmounted from the DOM.
      Perform any necessary cleanup in this method, such as invalidating timers or
       cleaning up any DOM elements that were created in componentDidMount*/
    Store.removeListener('change', this.onChangeStore);
    /*Store is attached to app/flux/store*/
    /*this.onChangeStore executes: this.setState(state); where state is a param of the function*/
  },
  onChangeStore(state) {
    this.setState(state);
    /*setState() -A common way to inform React of a data change is by calling setState(data, callback).
        This method merges data into this.state and re-renders the component. When the component finishes
        re-rendering, the optional callback is called. Most of the time you'll never need to provide a
        callback since React will take care of keeping your UI up-to-date for you.*/
  },
  showTakeover() {
    const { currentPage, takeover } = this.state;
    return currentPage === 'home' && takeover && !takeover.seen;
  },
  renderModal() {
    const { takeover, modal: modalType } = this.state;
    let modal;
    if (this.showTakeover()) {
      modal = <TakeOver key="takeover" takeover={takeover} />;
    } else if (modalType) {
      let content;
      let className;
      switch(modalType) {
        case 'navigation':
          className = 'navigation';
          content = <NavigationOverlay
            pages={this.state.navMain}
            section={this.state.currentPage.split('/')[0]}
          />;
          break;
        case 'contacts':
          className = 'tray';
          content = <ContactTray contacts={state.footer.contacts} />;
          break;
        case 'blogCategories':
          className = 'modal-blog-categories';
          content = <BlogCategories />;
          break;
      }
      modal = <Modal key={modalType} className={className}>{content}</Modal>;
    }
    return modal;
  },
  render() {
    const state = this.state;
    const appClasses = classnames('app', {
      'app-404': state.currentPage === 'notfound'
    });
    const contentClasses = classnames('app-content', {
      'takeover': this.showTakeover(),
      'disabled': !!state.modal,
      'mobile-no-scroll': state.modal || this.showTakeover()
    });
    let content;
    if (state.currentPage === 'notfound') {
      content = <div className={appClasses}>
        <Navigation
          pages={state.navMain}
          section={state.currentPage.split('/')[0]}
          page={state.currentPage.split('/')[1]}
          takeover={this.showTakeover()}
        />
        <FourOhFour {...this.state} />
        {this.renderModal()}
      </div>;
    } else {
      content = <div className={appClasses}>
        <Meta
          title={get(state, 'page.seo.title') || get(state, 'post.seo.title') || ''}
          meta={[{
            name: "description",
            content: get(state, 'page.seo.desc') || get(state, 'post.seo.desc') || ''
          }, {
            name: "keywords",
            content: get(state, 'page.seo.keywords') || get(state, 'post.seo.keywords') || ''
          }, {
            name: "og:type",
            content: 'website'
          }, {
            name: "og:title",
            content: get(state, 'page.seo.title') || get(state, 'post.seo.title') || ''
          }, {
            name: "og:description",
            content: get(state, 'page.seo.desc') || get(state, 'post.seo.desc') || ''
          }, {
            name: "og:image",
            content: get(state, 'page.seo.image') || get(state, 'post.seo.image') || ''
          }]}
        />
        <EntranceTransition className="nav-wrapper">
          <Navigation
            pages={state.navMain}
            section={state.currentPage.split('/')[0]}
            page={state.currentPage.split('/')[1]}
            takeover={this.showTakeover()}
          />
        </EntranceTransition>
        <PageContainer key={state.currentPage} extraClasses={contentClasses}>
          <TransitionManager
            component="div"
            className="page-loader-container"
            duration={700}
          >
            {this.getPage(state.currentPage)}
          </TransitionManager>
          <Footer data={state.footer} studios={state.studios} currentPage={this.state.currentPage}/>
        </PageContainer>
        <TransitionManager
          component="div"
          className="app__modal"
          duration={500}
        >
          {this.renderModal()}
        </TransitionManager>
      </div>;
    }
    return content;
  },
  getPage(pageId) {
    const { currentPage, page: pageData, post, caseStudy} = this.state;
    let page;
    if(!includes(spinnerBlacklist, currentPage) && !pageData && !post && !caseStudy) {
      page = <PageLoader key="loader" pageId={pageId} />;
    } else {
      page = React.createElement(pageMap[pageId], Object.assign({ key: `page-${pageId}` }, this.state));
    }
    return page;
  }
});

export default App;
