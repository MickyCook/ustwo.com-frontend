import spannify from '../../src/app/_lib/spannify';

describe('Spannify', () => {

  let result;

  beforeEach(() => {
    result = spannify('test words');
  });

  it('should return one component for each word', () => {
    expect(result.length).to.equal(2);
  });

  it('should wrap the words in spans', () => {
    result.forEach(component => {
      expect(component.type).to.equal('span');
    });
  });

  it('should include the word in the contents of each span', () => {
    expect(result[0].props.children).to.have.string('test');
    expect(result[1].props.children).to.have.string('words');
  });

  it('should concat any spaces to the ends of the previous word', () => {
    expect(result[0].props.children).to.equal('test ');
    expect(result[1].props.children).to.equal('words');
  });

  describe('if an optional className is passed', () => {

    beforeEach(() => {
      result = spannify('test words', 'hello');
    });

    it('should set the class on each span', () => {
      result.forEach(component => {
        expect(component.props.className).to.equal('hello');
      });
    });

  });

});
