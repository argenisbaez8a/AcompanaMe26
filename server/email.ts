import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface CriticalPatternEmailParams {
  to: string;
  guardianName: string;
  studentName: string;
  patternDetails: string;
}

export async function sendCriticalPatternAlert(
  params: CriticalPatternEmailParams
): Promise<boolean> {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 24px;">🚨 Alerta de Bienestar Mental - MindCare</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Notificación importante sobre ${params.studentName}</p>
        </div>

        <div style="background: #fff5f5; border: 2px solid #fed7d7; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #e53e3e; margin-top: 0;">⚠️ Patrón Preocupante Detectado</h2>
          <p style="color: #2d3748; line-height: 1.6;">
            Estimado/a ${params.guardianName},
          </p>
          <p style="color: #2d3748; line-height: 1.6;">
            Nos ponemos en contacto contigo porque hemos detectado un patrón preocupante en el estado emocional de ${params.studentName} a través de la aplicación MindCare.
          </p>
          <div style="background: white; border-left: 4px solid #e53e3e; padding: 15px; margin: 15px 0;">
            <strong style="color: #e53e3e;">Patrón detectado:</strong>
            <p style="margin: 5px 0; color: #2d3748;">${params.patternDetails}</p>
          </div>
        </div>

        <div style="background: #f7fafc; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #2d3748; margin-top: 0;">🤝 Recomendaciones Inmediatas</h3>
          <ul style="color: #2d3748; line-height: 1.6;">
            <li><strong>Conversa con ${params.studentName}</strong> de manera calmada y sin juzgar sobre cómo se siente</li>
            <li><strong>Ofrece apoyo emocional</strong> y hazle saber que está seguro/a contigo</li>
            <li><strong>Considera buscar ayuda profesional</strong> si el patrón continúa</li>
            <li><strong>Mantén la comunicación abierta</strong> y revisa regularmente su bienestar</li>
          </ul>
        </div>

        <div style="background: #fed7e2; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #97266d; margin-top: 0;">🆘 ¿Necesitas Ayuda Inmediata?</h3>
          <p style="color: #2d3748; line-height: 1.6;">
            Si ${params.studentName} está en peligro inmediato o ha expresado ideas de autolesión:
          </p>
          <div style="background: white; padding: 15px; border-radius: 5px; text-align: center; margin-top: 10px;">
            <strong style="color: #97266d; font-size: 18px;">📞 Línea de Crisis: 988</strong>
            <p style="margin: 5px 0; color: #2d3748;">Disponible 24/7 para crisis de salud mental</p>
          </div>
        </div>

        <div style="background: #e6fffa; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #234e52; margin-top: 0;">📱 Sobre MindCare</h3>
          <p style="color: #2d3748; line-height: 1.6;">
            MindCare es una aplicación de bienestar mental que ayuda a los jóvenes a monitorear su estado emocional 
            y acceder a herramientas de apoyo. Este sistema de alertas está diseñado para detectar patrones 
            que requieren atención y mantener informados a los cuidadores.
          </p>
        </div>

        <div style="text-align: center; color: #718096; font-size: 14px; margin-top: 30px;">
          <p>Este correo fue generado automáticamente por MindCare cuando se detectó un patrón preocupante.</p>
          <p>Por favor, no respondas a este correo. Si necesitas soporte técnico, contacta al administrador de la aplicación.</p>
          <p>Fecha: ${new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>
    `;

    const textContent = `
ALERTA DE BIENESTAR MENTAL - MindCare

⚠️ PATRÓN PREOCUPANTE DETECTADO

Estimado/a ${params.guardianName},

Nos ponemos en contacto contigo porque hemos detectado un patrón preocupante en el estado emocional de ${params.studentName} a través de la aplicación MindCare.

PATRÓN DETECTADO:
${params.patternDetails}

RECOMENDACIONES INMEDIATAS:
• Conversa con ${params.studentName} de manera calmada y sin juzgar sobre cómo se siente
• Ofrece apoyo emocional y hazle saber que está seguro/a contigo
• Considera buscar ayuda profesional si el patrón continúa
• Mantén la comunicación abierta y revisa regularmente su bienestar

¿NECESITAS AYUDA INMEDIATA?
Si ${params.studentName} está en peligro inmediato o ha expresado ideas de autolesión:
📞 Línea de Crisis: 988 (Disponible 24/7)

SOBRE MindCare:
MindCare es una aplicación de bienestar mental que ayuda a los jóvenes a monitorear su estado emocional y acceder a herramientas de apoyo.

Este correo fue generado automáticamente el ${new Date().toLocaleDateString('es-ES')}.
Por favor, no respondas a este correo.
    `;

    await mailService.send({
      to: params.to,
      from: 'noreply-mindcare@replit.app', // Use a generic sender address
      subject: `🚨 Alerta MindCare: Patrón preocupante detectado - ${params.studentName}`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`Critical pattern alert email sent to: ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}