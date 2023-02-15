import { IonRouterOutlet } from '@ionic/react'
import { pages } from 'data/pageData'
import React from 'react'
import { Redirect, Route } from 'react-router'

const Routes = () => {
  return (
    <IonRouterOutlet id="main">
        {
            pages.map((page) => {
            return (
                <Route 
                path={page.variable? page.path+"/:"+page.variable : page.path}
                exact={page.isExact}
                component={page.component}
                key={page.label}
                >
                {page.isRedirect && <Redirect to={page.path} />}
                </Route>
            )
            })
        }    
    </IonRouterOutlet>

  )
}

export default Routes