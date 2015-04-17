jest.dontMock('lodash');
jest.dontMock('../react-super-select.js');

describe('ReactSuperSelect', function() {
  var React = require('react/addons'),
      _ = require('lodash'),
      ReactSuperSelect = require('../react-super-select.js'),
      TestUtils = React.addons.TestUtils;

  var renderComponent = function(userProps) {
    var props = _.extend({}, {
      onChange: jest.genMockFunction(),
      dataSource: mockData
    }, userProps);
    var reactComponent = React.createElement(ReactSuperSelect, props);
    return TestUtils.renderIntoDocument(reactComponent);
  };

  var renderAndOpen = function(props) {
    var el = renderComponent(props);
    el.setState({
      isOpen: true
    });
    return el;
  };

  var mockData = [
          {'id': 1, 'name': 'option one', 'blah': 'blah one', 'fancyprop': 'I am a fancy one', 'type': 'widget'},
          {'id': 2, 'name': 'option two', 'blah': 'blah two', 'fancyprop': 'I am a fancy two', 'type': 'whatzit'},
          {'id': 3, 'name': 'option three', 'blah': 'blah three', 'fancyprop': 'I am a fancy three', 'type': 'thingamajig'},
          {'id': 4, 'name': 'option four', 'blah': 'blah four', 'fancyprop': 'I am a fancy four', 'type': 'whatzit'},
          {'id': 5, 'name': 'option five', 'blah': 'blah five', 'fancyprop': 'I am a fancy five', 'type': 'widget'}
        ];

  describe('render', function() {

    var el;

    beforeEach(function() {
      el = renderComponent({
        'placeholder': 'I am a placeholder'
      });
    });

    it('will render', function() {
      expect(el.getDOMNode()).toBeTruthy();
    });

    it('will render the trigger div', function() {
      var trigger = el.refs.triggerDiv;

      expect(trigger.getDOMNode()).toBeTruthy();
    });

    it('will render the carat span', function() {
      var carat = el.refs.carat;

      expect(carat.getDOMNode()).toBeTruthy();
    });

    it('carat span has up class when open', function() {
      var carat = el.refs.carat;
      el.setState({
        'isOpen': false
      });

      expect(carat.props.className.indexOf('up')).toBe(-1);
      expect(carat.props.className.indexOf('down')).toBeGreaterThan(-1);
    });

    it('carat span has down class when closed', function() {
      var carat = el.refs.carat;
      el.setState({
        'isOpen': true
      });

      expect(carat.props.className.indexOf('down')).toBe(-1);
      expect(carat.props.className.indexOf('up')).toBeGreaterThan(-1);
    });

    it('will render the mockInput value display anchor', function() {
      var mockInput = el.refs.valueDisplay;

      expect(mockInput.getDOMNode()).toBeTruthy();
    });

    it('trigger value display will show placeholder if provided', function() {
      var valueDisplay = el.refs.valueDisplay;

      expect(valueDisplay.props.children).toBe('I am a placeholder');
    });

    it('adds placeholder display class when value unset', function() {
      var valueDisplay = el.refs.valueDisplay;

      expect(valueDisplay.props.className.indexOf('r-ss-placeholder')).toBeGreaterThan(-1);
    });

    it('does not add placeholder display class when value set', function() {
      var valueDisplay = el.refs.valueDisplay;
      el.setState({
        value: 'blah'
      });

      expect(valueDisplay.props.className.indexOf('r-ss-placeholder')).toBe(-1);
    });

    it('does not render dropdown when isOpen is false', function() {
      expect(el.refs.dropdownContent).toBeFalsy();
    });

  });

  describe('toggleDropdown', function() {

    var el;

    beforeEach(function() {
      el = renderComponent();
    });

    it('toggles dropdown on trigger click', function() {
      TestUtils.Simulate.click(el.refs.triggerDiv.getDOMNode(), {});

      expect(el.state.isOpen).toBe(true);

      TestUtils.Simulate.click(el.refs.triggerDiv.getDOMNode(), {});

      expect(el.state.isOpen).toBe(false);
    });

    it('toggles dropdown on keypress of down arrow', function() {
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.down
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('toggles dropdown on keypress of space bar', function() {
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.space
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('toggles dropdown on keypress of enter key', function() {
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.enter
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('toggles dropdown on keypress of space key', function() {
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.space
      });

      expect(el.state.isOpen).toBe(true);
    });

    it('closes dropdown on keypress of esc key', function() {
      el.setState({
        isOpen: true
      });
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.esc
      });

      expect(el.state.isOpen).toBe(false);
    });

  });

  describe('focus handling', function() {

    it('focuses searchbox when searchable and expanded by keypress', function() {
      var el = renderComponent({
        searchable: true
      });
      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.down
      });

      expect(document.activeElement).toBe(el.refs.searchInput.getDOMNode());
    });

    it('focuses first option when not searchable and expanded by keypress', function() {
      var el = renderComponent({
        searchable: false
      });
      var focusSpy = spyOn(el, '_focusDOMOption').andCallThrough();

      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.down,
        preventDefault: _.noop,
        stopPropagation: _.noop
      });

      expect(focusSpy).toHaveBeenCalled();
      expect(el.state.focusedId).toBe(0);
    });

    it('focuses first option on home key keypress', function() {
      var el = renderComponent();
      var focusSpy = spyOn(el, '_focusDOMOption').andCallThrough();

      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.home,
        preventDefault: _.noop,
        stopPropagation: _.noop
      });

      expect(focusSpy).toHaveBeenCalled();
      expect(el.state.focusedId).toBe(0);
    });

    it('focuses last option on end key keypress', function() {
      var el = renderComponent();
      var focusSpy = spyOn(el, '_focusDOMOption').andCallThrough();

      TestUtils.Simulate.keyUp(el.refs.triggerDiv.getDOMNode(), {
        which: el.keymap.end,
        preventDefault: _.noop,
        stopPropagation: _.noop
      });

      expect(focusSpy).toHaveBeenCalled();
      expect(el.state.focusedId).toBe(mockData.length - 1);
    });

  });

  describe('dropdownContent', function() {

    it('renders dropdown when isOpen is true', function() {
      var el = renderAndOpen();

      expect(el.refs.dropdownContent).toBeTruthy();
    });

    it('does not render searchInput if searchable prop is false', function() {
      var el = renderAndOpen({
        searchable: false
      });

      expect(el.refs.searchInput).toBeFalsy();
    });

    it('renders searchInput if searchable prop is true', function() {
      var el = renderAndOpen({
        searchable: true
      });

      expect(el.refs.searchInput).toBeTruthy();
    });

    it('renders the default magnifier if a custom magnifier is not set', function() {
      var el = renderAndOpen({
        searchable: true
      });
      var anchor = TestUtils.findRenderedDOMComponentWithClass(el, 'r-ss-magnifier');

      expect(anchor).toBeTruthy();
    });

    it('renders the user specified magnifier class if prop is set', function() {
      var el = renderAndOpen({
        searchable: true,
        'customSearchIconClass': 'boo-yahhhhhh'
      });

      var customAnchor = TestUtils.findRenderedDOMComponentWithClass(el, 'boo-yahhhhhh');

      expect(customAnchor).toBeTruthy();
    });

    it('renders searchInput placeholer when prop is provided', function() {
      var el = renderAndOpen({
        searchable: true,
        searchPlaceholder: 'search placeholder'
      });

      expect(el.refs.searchInput.props.placeholder).toBe('search placeholder');
    });

    it('shows no results content when dataSource empty', function() {
      var el = renderAndOpen({
        dataSource: []
      });

      expect(el.refs.noResults).toBeTruthy();
    });

    it('shows no results content with custom string when provided', function() {
      var el = renderAndOpen({
        noResultsString: 'blah',
        dataSource: []
      });

      expect(el.refs.noResults.props.children).toBe('blah');
    });

  });

  describe('dropdown template content', function() {

    it('renders the default list item content when no template is provided', function() {
      var el = renderAndOpen();

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el.refs.dropdownOptionsList, 'r-ss-dropdown-option');

      expect(optionElements.length).toBe(mockData.length);
    });

    it('renders custom list item content when a mapper function is provided', function() {
      var el = renderComponent({
        customOptionTemplateFunction: function(option) {
          var text = option.name;
          return React.createElement("aside", {className: "custom-option"}, text);
        }
      });
      el.setState({
        isOpen: true
      });

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el.refs.dropdownOptionsList, 'custom-option');

      expect(optionElements.length).toBe(mockData.length);
    });

  });

  describe('search results filter', function() {

    it('filters the default option list by label', function() {
      var el = renderAndOpen();
      el.setState({
        'searchString': 'two'
      });

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el.refs.dropdownOptionsList, 'r-ss-dropdown-option');

      expect(optionElements.length).toBe(1);
    });

    it('filters by custom filter function', function() {
      var el = renderComponent({
        customFilterFunction: function(option) {
          return (option.name.indexOf('option t') === 0);
        }
      });
      el.setState({
        'isOpen': true,
        'searchString': 'three'
      });

      var optionElements = TestUtils.scryRenderedDOMComponentsWithClass(el.refs.dropdownOptionsList, 'r-ss-dropdown-option');

      expect(optionElements.length).toBe(2);
    });

  });

  describe('single item selection', function() {

    it('selects item by click', function() {
      var el = renderAndOpen();
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1]);
    });

    it('selects item by keyup for enter', function() {
      var el = renderAndOpen();
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
      el._updateFocusedId(0);

      TestUtils.Simulate.keyUp(options[0], {
        which: el.keymap.enter
      });

      expect(el.state.value[0]).toBe(mockData[0]);
      expect(el.props.onChange.mock.calls[0][0]).toBe(mockData[0]);
    });

    it('selects item by keyup for space bar', function() {
      var el = renderAndOpen();
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
      el._updateFocusedId(0);

      TestUtils.Simulate.keyUp(options[0], {
        which: el.keymap.space
      });

      expect(el.state.value[0]).toBe(mockData[0]);
      expect(el.props.onChange.mock.calls[0][0]).toBe(mockData[0]);
    });

  });

  describe('multiple item selection', function() {

    var getElWithThreeTags = function() {
          var el = renderAndOpen({
            tags: true
          });
          var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

          TestUtils.Simulate.click(options[1], {
            metaKey: true
          }, options[1].id);

          TestUtils.Simulate.click(options[3], {
            metaKey: true
          }, options[3].id);

          TestUtils.Simulate.click(options[4], {
            metaKey: true
          }, options[4].id);

          return el;
        };

    it('selects multiple items by ctrl or meta-key click', function() {
      var el = renderAndOpen({
        multiple: true
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1], {
        metaKey: true
      }, options[1].id);

      TestUtils.Simulate.click(options[3], {
        metaKey: true
      }, options[3].id);

      expect(_.isEqual(el.state.value, [mockData[1], mockData[3]])).toBe(true);
      expect(_.isEqual(el.props.onChange.mock.calls[1][0], [mockData[1], mockData[3]])).toBe(true);
    });

    it('will render multiple items as tags', function() {
      var el = getElWithThreeTags();

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags.length).toBe(3);
      expect(el.state.value.length).toBe(3);
    });

    it('will delete tag when remove tag button is clicked', function() {
      var el = getElWithThreeTags();

      var removeTagButtons = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag-remove');
      TestUtils.Simulate.click(removeTagButtons[0]);

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags.length).toBe(2);
      expect(el.state.value.length).toBe(2);
    });

    it('tag deletion works via enter key', function() {
      var el = getElWithThreeTags();

      var removeTagButtons = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag-remove');
      TestUtils.Simulate.keyUp(removeTagButtons[0], {
        which: el.keymap.enter,
        preventDefault: jest.genMockFunction(),
        stopPropagation: jest.genMockFunction()
      });

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags.length).toBe(2);
    });

    it('tag deletion works via space bar key', function() {
      var el = getElWithThreeTags();

      var removeTagButtons = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag-remove');
      TestUtils.Simulate.keyUp(removeTagButtons[0], {
        which: el.keymap.space,
        preventDefault: jest.genMockFunction(),
        stopPropagation: jest.genMockFunction()
      });

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags.length).toBe(2);
    });

    describe('shift-key multi-selection', function() {

      it('selects multiple sequential options on shift-click', function() {
        var el = renderAndOpen({
          tags: true
        });

        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
        TestUtils.Simulate.click(options[0], {
          metaKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        TestUtils.Simulate.click(options[3], {
          shiftKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 2
            }
          }
        }, options[3].id);

        var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
        expect(tags.length).toBe(4);
      });

      it('selects multiple sequential options on shift-keypress of enter', function() {
        var el = renderAndOpen({
          tags: true
        });

        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
        TestUtils.Simulate.click(options[0], {
          metaKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        el._updateFocusedId(3);

        TestUtils.Simulate.keyUp(options[3], {
          shiftKey: true,
          which: el.keymap.enter
        }, options[3].id);

        var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
        expect(tags.length).toBe(4);
      });

      it('selects multiple sequential options on shift-keypress of space bar', function() {
        var el = renderAndOpen({
          tags: true
        });

        var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
        TestUtils.Simulate.click(options[0], {
          metaKey: true,
          currentTarget: {
            attributes: {
              'data-option-index': 0
            }
          }
        }, options[0].id);

        el._updateFocusedId(3);

        TestUtils.Simulate.keyUp(options[3], {
          shiftKey: true,
          which: el.keymap.space
        }, options[3].id);

        var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
        expect(tags.length).toBe(4);
      });

    });

  });

  describe('Custom Class Options', function() {

    it('renders with customClass when provided', function() {
      var el = renderAndOpen({
        customClassName: 'yoClass'
      });

      expect(el.refs.rssControl.props.className).toMatch(/yoClass/);
    });

    it('renders tags with custom wrapper class when provided', function() {
      var el = renderAndOpen({
        tags: true,
        customTagClass: 'yoTagClass'
      });
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      TestUtils.Simulate.click(options[1], {
        metaKey: true
      }, options[1].id);

      var tags = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-tag');
      expect(tags[0].props.className).toMatch(/yoTagClass/);
    });

  });

  describe('Populating data source from ajax', function() {

    var el,
        mockAjaxThen;

    beforeEach(function() {
      mockAjaxThen = jest.genMockFunction();
      el = renderComponent({
        dataSource: undefined,
        customLoaderClass: "loaditUp",
        ajaxDataSource: jest.genMockFunction().mockReturnValue({
          then: mockAjaxThen
        })
      });
    });

    it('renders spinner when fetching ajax data', function() {
      el.toggleDropdown();

      expect(el.refs.loader.getDOMNode()).toBeTruthy();
    });

    it('renders spinner with custom class', function() {
      el.toggleDropdown();

      expect(el.refs.loader.props.className).toMatch(/loaditUp/);
    });

    it('renders ajax data', function() {
      el.toggleDropdown();
      var promiseCallback = mockAjaxThen.mock.calls[0][0];
      promiseCallback(mockData);

      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');
      expect(options.length).toBe(5);
    });

  });

  describe('GroupBy Functionality', function() {

    it('renders items in groups when groupBy option is a string', function() {
      var el = renderAndOpen({
        groupBy: 'type'
      });

      var headings = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-option-group-heading');
      var options = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-dropdown-option');

      expect(headings.length).toBe(3);
      expect(options.length).toBe(mockData.length);
    });

    it('renders items in groups when groupBy option is an object', function() {
      var el = renderAndOpen({
        groupBy: {'name': 'option three'}
      });

      var headings = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-option-group-heading');

      expect(headings.length).toBe(2);
    });

    it('renders items in groups when groupBy option is a function', function() {
      var el = renderAndOpen({
        groupBy: function(item) {
          return item.type !== 'whatzit';
        }
      });

      var headings = TestUtils.scryRenderedDOMComponentsWithClass(el, 'r-ss-option-group-heading');

      expect(headings.length).toBe(2);
    });

    it('renders custom group heading content when group heading template function is provided', function() {
      var el = renderAndOpen({
        groupBy: 'type',
        customGroupHeadingTemplateFunction: function(option) {
          var text = option.type;
          return React.createElement("aside", {className: "custom-heading"}, text);
        }
      });

      var customHeadings = TestUtils.scryRenderedDOMComponentsWithClass(el.refs.dropdownOptionsList, "custom-heading");

      expect(customHeadings.length).toBe(3);
    });

    it('renders items in groups with customHeadingClass', function() {
      var el = renderAndOpen({
        groupBy: 'type',
        customGroupHeadingClass: 'my-group'
      });

      var headings = TestUtils.scryRenderedDOMComponentsWithClass(el, 'my-group');

      expect(headings.length).toBe(3);
    });

  });


});
