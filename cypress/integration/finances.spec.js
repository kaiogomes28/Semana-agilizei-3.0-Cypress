/// <reference types="cypress" />

import { format, prepareLocalStorage } from '../support/utils'

describe('Dev Finances agilizei', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })

        cy.get('#data-table tbody tr').should('have.length', 2)
    });

    it('Cadastrar entradas', () => {
        
        cy.get('#transaction > .button').click()
        cy.get('#description').type('mesada')
        cy.get('[name=amount]').type(150)
        cy.get('[type=date]').type('2022-03-21')
        cy.get('button').contains('Salvar').click()
        
        cy.get('#data-table tbody tr').should('have.length', 3)
    }); 

    it('Cadastrar saidas', () => {

        cy.get('#transaction > .button').click()
        cy.get('#description').type('Luz')
        cy.get('[name=amount]').type(-50)
        cy.get('[type=date]').type('2022-03-21')
        cy.get('button').contains('Salvar').click()
        
        cy.get('#data-table tbody tr').should('have.length', 3)
    }); 

    it('Remover entradas e saidas', () => {
        cy.get('td.description')
        .contains("Mesada")
        .parent()
        .find('img[onclick*=remove]')
        .click()

        cy.get('td.description')
        .contains("Suco Kapo")
        .siblings()
        .children('img[onclick*=remove]')
        .click()

        cy.get('#data-table tbody tr').should('have.length', 0)
    });

    it('Validar saldo com diversas transações', () => {
        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
        .each(($el, index, $list) => {
            cy.get($el).find('td.income, td.expense')
                .invoke('text').then(text => {
                    if(text.includes('-')){
                        expenses = expenses + format(text)
                    } else{
                        incomes = incomes + format(text)
                    } 

                    cy.log(`entradas`, incomes)
                    cy.log(`saidas`,expenses)
                })
        })

        cy.get('#totalDisplay').invoke('text').then(text => {
            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses 

            expect(formattedTotalDisplay).to.eq(expectedTotal)
        })

    });
});