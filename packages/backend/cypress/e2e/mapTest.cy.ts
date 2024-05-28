describe('request should return coordinates of an address', () => {
    const baseURL = 'http://localhost:8081/api/map/geocode';
    const address = 'Fasanenstraße 86, 10623 Berlin, Germany';

    it('should return the long and lat of an address', () => {
        cy.request({
            method: 'GET',
            url: `${baseURL}?address=${address}`,
          })
          .then((response) => {
            expect(response.status).to.eq(200);
            expect((response.body)).to.be.an('object');
            expect((response.body.lat)).to.eq(52.50855);
            expect((response.body.lng)).to.eq(13.32883);
          });
      });
})