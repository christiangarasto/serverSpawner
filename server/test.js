const { exec } = require("child_process");

exec("sc query", (error, stdout, stderr) => {
  if (error) {
    console.error(`Errore nell'esecuzione del comando: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Errore: ${stderr}`);
    return;
  }

  // Processa l'output
  const services = parseServices(stdout);
  console.log("Servizi attivi:", services);
});

function parseServices(output) {
  const services = [];
  const lines = output.split("\n");

  let currentService = null;
  lines.forEach((line) => {
    if (line.startsWith("SERVICE_NAME:")) {
      if (currentService) {
        services.push(currentService);
      }
      currentService = { name: line.split(": ")[1] };
    } else if (line.startsWith("        STATE")) {
      if (currentService) {
        const stateMatch = line.match(/STATE\s*:\s*\d+\s*(\w+)/);
        if (stateMatch) {
          currentService.state = stateMatch[1];
        }
      }
    }
  });

  if (currentService) {
    services.push(currentService);
  }

  return services;
}
