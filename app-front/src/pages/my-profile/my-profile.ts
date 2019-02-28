import { MyProfileGeneralStatsComponent } from './general-stats-data/general-stats-data.component';
import { MyProfileMenu } from './../components/menu/my-profile-menu';
import { MyProfileSportsComponent } from './sports-data/sports-data.component';
import { MyProfilePersonalDataComponent } from './personal-data/personal-data.component';
import { ProfileStepDirective } from './profile-step.directive';
import { Component, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { IonicPage} from 'ionic-angular';
import { Api, User } from '../../providers';
import { MyProfileStatsComponent } from './stats-data/stats-data.component';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
    selector: 'my-profile',
    templateUrl: 'my-profile.html'
})
export class MyProfilePage {

    @ViewChild(ProfileStepDirective) profileStep: ProfileStepDirective; 
    @ViewChild(MyProfileMenu) profileMenu: MyProfileMenu;

    private ListComponents:any = {
        personalData    : MyProfilePersonalDataComponent,
        sportsData      : MyProfileSportsComponent,
        statsData       : MyProfileStatsComponent
    }

    public visibility:any[];

    constructor(
        public  user: User,
        private api: Api,
        private componentFactoryResolver: ComponentFactoryResolver,
        public translateService: TranslateService) { 
    
            this.translateService.setDefaultLang('pt-br');
            this.getVisibility();
        }

    //Função que inicializa
    ngOnInit() {
        this.loadComponent();
    }

    //Função para carregar componentes 
    loadComponent($component = MyProfilePersonalDataComponent) {
        
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory($component);

        let viewContainerRef = this.profileStep.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.
        createComponent(componentFactory);

        (componentRef.instance).visibility = this.visibility;
    }

    //Mudar a visualização de componentes
    changeComponentView($event){
        this.loadComponent(this.ListComponents[$event]);        
    }

    getVisibility() {
        //Retorna a lista de esportes do banco e atribui ao seletor
        let items = this.api.get('timeline/visibility').subscribe((resp: any) => {

            //Se não existir items a exibir
            if (resp.length > 0) {
                this.visibility = resp;
            }

        }, err => {
            return;
        });

    }

}
