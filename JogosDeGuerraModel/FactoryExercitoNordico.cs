using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JogosDeGuerraModel
{
    class FactoryExercitoNordico : AbstractFactoryExercito
    {
        public override Arqueiro CriarArqueiro()
        {
            return new ArqueiroNordico();
        }

        public override Cavaleiro CriarCavalaria()
        {
            return new CavaleiroNordico();
        }

        public override Guerreiro CriarGuerreiro()
        {
            return new GuerreiroNordico();
        }
    }
}
